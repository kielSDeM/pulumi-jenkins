# pulumi-jenkins

This deploys jenkins from a mini cluster with typescript.

https://awstip.com/use-pulumi-to-deploy-a-jenkins-46dae6f8b12a

To access jenkins you need the pod name, cluster ip, and password:   
```
minikube ip,
```                                     
``` 
kubectl get pods -n jenkins 
```                                      
 ```
 kubectl logs <pod_name> -n jenkins 
 ```                                    
# The password can be found at the end of the logs                                     
# or you can use the path: /var/jenkins_home/secrets/initialAdminPassword

