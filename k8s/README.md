# Déploiement Kubernetes - Projet Alomra

Ce dossier contient tous les fichiers nécessaires pour déployer l'application Alomra sur Kubernetes avec Minikube.

## 📁 Structure des fichiers

- `deploy-all.yaml` - Fichier principal contenant toutes les ressources
- `mysql-secret.yaml` - Secrets pour MySQL
- `mysql-config.yaml` - ConfigMap pour MySQL
- `mysql.yaml` - Déploiement et service MySQL
- `backend.yaml` - Déploiement et service Backend
- `frontend.yaml` - Déploiement et service Frontend
- `ingress.yaml` - Configuration Ingress
- `namespace.yaml` - Namespace Alomra
- `deploy.sh` - Script de déploiement (Linux/Mac)
- `deploy.ps1` - Script de déploiement (Windows)

## 🚀 Déploiement rapide

### Windows (PowerShell)
```powershell
cd k8s
.\deploy.ps1
```

### Linux/Mac (Bash)
```bash
cd k8s
chmod +x deploy.sh
./deploy.sh
```

### Déploiement manuel
```bash
kubectl apply -f deploy-all.yaml
```

## 🧹 Nettoyage des anciennes ressources

### Supprimer le namespace complet
```bash
kubectl delete namespace alomra
```

### Supprimer des ressources spécifiques
```bash
kubectl delete secret mysql-secret --ignore-not-found=true
kubectl delete configmap mysql-config --ignore-not-found=true
kubectl delete configmap mysql-init-config --ignore-not-found=true
```

## 📊 Vérification du déploiement

### Vérifier les pods
```bash
kubectl get pods -n alomra
```

### Vérifier les services
```bash
kubectl get services -n alomra
```

### Vérifier l'ingress
```bash
kubectl get ingress -n alomra
```

### Voir les logs d'un pod
```bash
kubectl logs <nom-du-pod> -n alomra
```

## 🌐 Accès à l'application

1. Obtenir l'IP de Minikube :
   ```bash
   minikube ip
   ```

2. Ajouter l'entrée dans le fichier hosts :
   - Windows : `C:\Windows\System32\drivers\etc\hosts`
   - Linux/Mac : `/etc/hosts`
   
   Ajouter cette ligne :
   ```
   <IP_DE_MINIKUBE> alomra.local
   ```

3. Accéder à l'application :
   - Frontend : http://alomra.local
   - Backend API : http://alomra.local/api

## 🔑 Identifiants par défaut

- **Email** : admin@admin.com
- **Mot de passe** : adminadmin

## 📋 Configuration

### Variables d'environnement Backend
- `DB_HOST` : mysql-service
- `DB_PORT` : 3306
- `DB_USER` : mysql_admin
- `DB_PASSWORD` : mysql_password
- `DB_NAME` : alomra
- `JWT_SECRET` : alomra-jwt-secret-key-2024

### Variables d'environnement Frontend
- `NEXT_PUBLIC_API_URL` : http://backend-service:5000
- `NODE_ENV` : production

## 🗄️ Base de données

La base de données MySQL est initialisée automatiquement avec :
- Base de données : `alomra`
- Tables : `users`, `motifs`, `reclamations`, `reclamation_motif`
- Utilisateur admin par défaut

## 🔧 Dépannage

### Pods en état Pending
```bash
kubectl describe pod <nom-du-pod> -n alomra
```

### Problèmes de connexion à la base de données
```bash
kubectl logs -l app=backend -n alomra
```

### Problèmes d'ingress
```bash
kubectl describe ingress alomra-ingress -n alomra
```

### Redémarrer un déploiement
```bash
kubectl rollout restart deployment/backend-deployment -n alomra
kubectl rollout restart deployment/frontend-deployment -n alomra
```

## 📦 Images Docker utilisées

- **Backend** : `nebag/alomra-project-backend:latest`
- **Frontend** : `nebag/alomra-project-frontend:latest`
- **MySQL** : `mysql:8`

## 🔄 Mise à jour

Pour mettre à jour l'application :

1. Pousser les nouvelles images Docker
2. Redémarrer les déploiements :
   ```bash
   kubectl rollout restart deployment/backend-deployment -n alomra
   kubectl rollout restart deployment/frontend-deployment -n alomra
   ``` 