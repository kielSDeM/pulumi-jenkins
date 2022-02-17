import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import { storage } from "@pulumi/kubernetes";

const config = new pulumi.Config();
const isMinikube = config.requireBoolean("isMinikube");

const appName = "jenkins"
const appLabels = { app: appName };
const deployment = new k8s.apps.v1.Deployment(appName, {
    spec: {
        selector: { matchLabels: appLabels },
        replicas: 1,
        template: {
            metadata: { labels: appLabels},   
            spec: { containers: [{ 
                name: appName, 
                image: "jenkins/jenkins", 
                ports:[{containerPort: 8080}],
                volumeMounts: [{name: "jenkins-home", 
                mountPath: "/var/jenkins-home"}],
            }],
            volumes: [{
                name: "jenkins-home", 
                emptyDir: { }}]
            }
        }
    }
});

const service = new k8s.core.v1.Service(appName, {
    metadata: {labels: deployment.spec.template.metadata.labels},
    spec : { 
        type: isMinikube ? "ClusterIP" : "LoadBalancer",
        ports: [{port: 8080, targetPort: 8080}],
        selector: appLabels
    }
});

const volume = new k8s.core.v1.PersistentVolume(appName, {
    metadata: {name: "jenkins-pv", namespace: "jenkins"},
    spec : {
        storageClassName: "jenkins-pv",
        accessModes: ["ReadWriteOnce"],
        capacity: {storage: "20Gi"} ,
        persistentVolumeReclaimPolicy: "Retain",
        hostPath: {path: "/data/jenkins-volume/"}
    }
})


export const ip = isMinikube
    ? service.spec.clusterIP
    : service.status.loadBalancer.apply(
          (lb) => lb.ingress[0].ip || lb.ingress[0].hostname
      );
