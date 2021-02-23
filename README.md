## setups

### update common npm module

```
npm run u
```

### set k8s secret

```
kubectl create secret generic jwt-secret --from-literal JWT_KEY=kjsjfksldjfsfsl
kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=kjsjfksldjfsfsl
```

### deploy nginx ingress controller

```

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.40.2/deploy/static/provider/cloud/deploy.yaml
skaffold dev
```

### create branch and merge workflow

```
git checkout -b dev
git add .
git commit -m "changes in child branch: add clg"
git push origin dev
# github -> pull request -> new pull request -> dev->master -> create pull request -> (after checks) merge pull request
```
