#!/bin/bash

echo "🚀 Déploiement de l'application Alomra sur Kubernetes..."

# Vérifier que minikube est démarré
if ! minikube status | grep -q "Running"; then
    echo "⚠️  Minikube n'est pas démarré. Démarrage en cours..."
    minikube start
fi

# Activer l'ingress addon
echo "📦 Activation du plugin Ingress..."
minikube addons enable ingress

# Supprimer les anciennes ressources si elles existent
echo "🧹 Nettoyage des anciennes ressources..."
kubectl delete namespace alomra --ignore-not-found=true
kubectl delete secret mysql-secret --ignore-not-found=true
kubectl delete configmap mysql-config --ignore-not-found=true
kubectl delete configmap mysql-init-config --ignore-not-found=true

# Attendre que le namespace soit supprimé
echo "⏳ Attente de la suppression du namespace..."
sleep 10

# Déployer toutes les ressources
echo "📋 Déploiement des ressources Kubernetes..."
kubectl apply -f deploy-all.yaml

# Attendre que les pods soient prêts
echo "⏳ Attente du démarrage des pods..."
kubectl wait --for=condition=ready pod -l app=mysql -n alomra --timeout=300s
kubectl wait --for=condition=ready pod -l app=backend -n alomra --timeout=300s
kubectl wait --for=condition=ready pod -l app=frontend -n alomra --timeout=300s

# Afficher le statut des pods
echo "📊 Statut des pods:"
kubectl get pods -n alomra

# Afficher les services
echo "🔗 Services créés:"
kubectl get services -n alomra

# Afficher l'ingress
echo "🌐 Ingress créé:"
kubectl get ingress -n alomra

# Obtenir l'IP de minikube
MINIKUBE_IP=$(minikube ip)
echo "🎉 Déploiement terminé!"
echo "📍 IP de Minikube: $MINIKUBE_IP"
echo "🌐 Application accessible sur: http://alomra.local"
echo "📝 Pour accéder à l'application, ajoutez cette ligne à votre fichier hosts:"
echo "   $MINIKUBE_IP alomra.local"
echo ""
echo "🔑 Identifiants par défaut:"
echo "   Email: admin@admin.com"
echo "   Mot de passe: adminadmin" 