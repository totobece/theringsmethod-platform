#!/bin/bash

echo "🔧 === NGINX CONFIGURATION CHECK ==="
echo ""

# Check if nginx is running
echo "1. 🚀 Nginx Status:"
systemctl status nginx --no-pager | head -5
echo ""

# Test nginx configuration
echo "2. ✅ Nginx Configuration Test:"
nginx -t
echo ""

# Show current nginx sites
echo "3. 📁 Available Sites:"
ls -la /etc/nginx/sites-available/
echo ""

echo "4. 📎 Enabled Sites:"
ls -la /etc/nginx/sites-enabled/
echo ""

# Check for theringsmethod config
echo "5. 🔍 Looking for theringsmethod configuration:"
if [ -f "/etc/nginx/sites-available/theringsmethod" ]; then
    echo "✅ Found /etc/nginx/sites-available/theringsmethod"
    echo ""
    echo "📄 Current configuration:"
    cat /etc/nginx/sites-available/theringsmethod
elif [ -f "/etc/nginx/sites-available/app.theringsmethod.com" ]; then
    echo "✅ Found /etc/nginx/sites-available/app.theringsmethod.com"
    echo ""
    echo "📄 Current configuration:"
    cat /etc/nginx/sites-available/app.theringsmethod.com
elif [ -f "/etc/nginx/sites-available/default" ]; then
    echo "✅ Found /etc/nginx/sites-available/default"
    echo ""
    echo "📄 Current configuration:"
    cat /etc/nginx/sites-available/default
else
    echo "❌ No theringsmethod configuration found"
    echo "Available configs:"
    ls -la /etc/nginx/sites-available/
fi

echo ""
echo "6. 🌐 Current listening ports:"
netstat -tlnp | grep nginx
echo ""

echo "7. 🔒 SSL Certificate check:"
if [ -d "/etc/letsencrypt/live/app.theringsmethod.com" ]; then
    echo "✅ SSL certificates found for app.theringsmethod.com"
    ls -la /etc/letsencrypt/live/app.theringsmethod.com/
else
    echo "❌ No SSL certificates found for app.theringsmethod.com"
    echo "Available certificates:"
    ls -la /etc/letsencrypt/live/ 2>/dev/null || echo "No letsencrypt certificates found"
fi

echo ""
echo "8. 📝 Recommended nginx configuration for The Rings Method:"
echo ""
cat << 'EOF'
server {
    listen 80;
    server_name app.theringsmethod.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.theringsmethod.com;

    ssl_certificate /etc/letsencrypt/live/app.theringsmethod.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.theringsmethod.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Headers for proper HTTPS handling
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Port $server_port;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

echo ""
echo "🔧 === CHECK COMPLETE ==="
echo ""
echo "Next steps:"
echo "1. If SSL certificates are missing: sudo certbot --nginx -d app.theringsmethod.com"
echo "2. If nginx config needs update: sudo nano /etc/nginx/sites-available/app.theringsmethod.com"
echo "3. Test config: sudo nginx -t"
echo "4. Reload nginx: sudo systemctl reload nginx"
