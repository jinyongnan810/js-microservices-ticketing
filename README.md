## setups

### set k8s secret

```
kubectl create secret generic jwt-secret --from-literal JWT_KEY=kjsjfksldjfsfsl
```

### deploy nginx ingress controller

```

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.40.2/deploy/static/provider/cloud/deploy.yaml
skaffold dev
```
