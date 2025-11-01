# DiniSohbet Deployment Guide

## Production Deployment

### 1. Docker Deployment

#### Prerequisites
- Docker and Docker Compose installed
- SSL certificates (for HTTPS)

#### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/dinisohbet.git
cd dinisohbet
```

2. **Configure environment variables**
Edit `docker-compose.yml` and update:
- `SESSION_SECRET`: Strong random string
- `JWT_SECRET`: Strong random string
- Database credentials if needed

3. **Prepare SSL certificates**
```bash
mkdir ssl
# Place your cert.pem and key.pem in the ssl directory
# For Let's Encrypt:
certbot certonly --standalone -d dinisohbet.com -d www.dinisohbet.com
cp /etc/letsencrypt/live/dinisohbet.com/fullchain.pem ./ssl/cert.pem
cp /etc/letsencrypt/live/dinisohbet.com/privkey.pem ./ssl/key.pem
```

4. **Build and run**
```bash
docker-compose up -d
```

5. **Check logs**
```bash
docker-compose logs -f app
```

### 2. PM2 Deployment (without Docker)

#### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running
- PM2 installed globally: `npm install -g pm2`

#### Steps

1. **Install dependencies**
```bash
npm install --production
```

2. **Create environment file**
Create `.env` file:
```
NODE_ENV=production
PORT=3002
MONGODB_URI=mongodb://localhost:27017/dinisohbet
SESSION_SECRET=your-session-secret
JWT_SECRET=your-jwt-secret
```

3. **Start with PM2**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

4. **Monitor**
```bash
pm2 monit
pm2 logs dinisohbet
```

### 3. Nginx Configuration (for PM2 deployment)

Install nginx:
```bash
sudo apt-get install nginx
```

Use the provided `nginx.conf` as a template:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/dinisohbet
sudo ln -s /etc/nginx/sites-available/dinisohbet /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. GitHub Actions CI/CD

1. **Add secrets to GitHub repository**
   - Go to Settings → Secrets → Actions
   - Add the following secrets:
     - `DOCKER_USERNAME`: Your Docker Hub username
     - `DOCKER_PASSWORD`: Your Docker Hub password
     - `SERVER_HOST`: Your server IP/domain
     - `SERVER_USER`: SSH username
     - `SSH_PRIVATE_KEY`: SSH private key for server access

2. **Push to main branch**
   - Any push to `main` will trigger automatic deployment

### 5. SSL Certificate Setup (Let's Encrypt)

```bash
# Install certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d dinisohbet.com -d www.dinisohbet.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 6. Monitoring and Maintenance

#### PM2 Commands
```bash
pm2 status              # Check status
pm2 restart dinisohbet  # Restart app
pm2 stop dinisohbet     # Stop app
pm2 delete dinisohbet   # Remove from PM2
pm2 logs dinisohbet     # View logs
```

#### Docker Commands
```bash
docker-compose ps              # Check status
docker-compose restart app     # Restart app
docker-compose logs -f app     # View logs
docker-compose down            # Stop all services
docker-compose up -d           # Start all services
```

### 7. Database Backup

```bash
# Backup MongoDB
mongodump --uri="mongodb://localhost:27017/dinisohbet" --out=/backup/mongodb-$(date +%Y%m%d)

# Restore MongoDB
mongorestore --uri="mongodb://localhost:27017/dinisohbet" /backup/mongodb-20240101
```

### 8. Performance Optimization

1. **Enable caching in nginx** (already configured)
2. **Use CDN for static assets**
3. **Enable Redis for sessions** (optional upgrade)
4. **Database indexing** (already implemented)

### 9. Security Checklist

- ✅ HTTPS enabled with valid SSL certificate
- ✅ Security headers configured (helmet + nginx)
- ✅ Rate limiting enabled
- ✅ Input validation and sanitization
- ✅ XSS protection
- ✅ Environment variables for secrets
- ✅ Regular security updates
- ✅ MongoDB authentication enabled
- ✅ Firewall configured (only 80, 443, 22 open)

### 10. Troubleshooting

**App won't start:**
```bash
# Check logs
docker-compose logs app
# or
pm2 logs dinisohbet

# Check port availability
sudo netstat -tulpn | grep 3002
```

**MongoDB connection issues:**
```bash
# Check MongoDB status
sudo systemctl status mongod
# or
docker-compose logs mongo
```

**Nginx errors:**
```bash
# Test configuration
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
```

### 11. Scaling

For high traffic, consider:
- Load balancer with multiple app instances
- MongoDB replica set
- Redis for session storage
- CDN for static assets
- Database sharding

### 12. Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Application port | 3002 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/dinisohbet |
| SESSION_SECRET | Session encryption key | (required) |
| JWT_SECRET | JWT signing key | (required) |

### Support

For issues, please check:
- Application logs
- MongoDB logs
- Nginx logs
- System resources (CPU, Memory, Disk)
