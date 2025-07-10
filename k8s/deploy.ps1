# Script de déploiement PowerShell pour Windows

Write-Host "🚀 Déploiement de l'application Alomra sur Kubernetes..." -ForegroundColor Green

# Vérifier que minikube est démarré
$minikubeStatus = minikube status
if ($minikubeStatus -notmatch "Running") {
    Write-Host "⚠️  Minikube n'est pas démarré. Démarrage en cours..." -ForegroundColor Yellow
    minikube start
}

# Supprimer les anciennes ressources si elles existent
Write-Host "🧹 Nettoyage des anciennes ressources..." -ForegroundColor Yellow
kubectl delete namespace alomra --ignore-not-found=true
kubectl delete secret mysql-secret --ignore-not-found=true
kubectl delete configmap mysql-config --ignore-not-found=true
kubectl delete configmap mysql-init-config --ignore-not-found=true

# Attendre que le namespace soit supprimé
Write-Host "⏳ Attente de la suppression du namespace..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Déployer toutes les ressources
Write-Host "📋 Déploiement des ressources Kubernetes..." -ForegroundColor Blue
kubectl apply -f deploy-all.yaml

# Attendre que les pods soient prêts
Write-Host "⏳ Attente du démarrage des pods..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app=mysql -n alomra --timeout=300s
kubectl wait --for=condition=ready pod -l app=backend -n alomra --timeout=300s
kubectl wait --for=condition=ready pod -l app=frontend -n alomra --timeout=300s

# Afficher le statut des pods
Write-Host "📊 Statut des pods:" -ForegroundColor Green
kubectl get pods -n alomra

# Afficher les services
Write-Host "🔗 Services créés:" -ForegroundColor Green
kubectl get services -n alomra

# Obtenir l'IP de minikube
$MINIKUBE_IP = minikube ip
Write-Host "🎉 Déploiement terminé!" -ForegroundColor Green
Write-Host "📍 IP de Minikube: $MINIKUBE_IP" -ForegroundColor Cyan
Write-Host "🌐 Application accessible sur:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:30100" -ForegroundColor White
Write-Host "   Backend API: http://localhost:30001" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Identifiants par défaut:" -ForegroundColor Green
Write-Host "   Email: admin@admin.com" -ForegroundColor White
Write-Host "   Mot de passe: adminadmin" -ForegroundColor White
Write-Host ""
Write-Host "📝 Pour tester l'accès direct:" -ForegroundColor Yellow
Write-Host "   Frontend: http://$MINIKUBE_IP`:30100" -ForegroundColor White
Write-Host "   Backend: http://$MINIKUBE_IP`:30001" -ForegroundColor White 