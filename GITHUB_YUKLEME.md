# GitHub'a Yükleme - Adım Adım Rehber

## ❌ Hata Aldık: Permission Denied (403)

GitHub artık terminal'den şifre kabul etmiyor. İki yöntem var:

---

## ✅ YÖNTEM 1: GitHub Desktop (ÖNERİLEN - 2 Dakika)

### Adımlar:

1. **GitHub Desktop İndir:**
   - https://desktop.github.com/
   - İndir ve kur

2. **GitHub Desktop'ı Aç:**
   - File → Options → Sign in
   - GitHub hesabınla giriş yap (sivriabbas)

3. **Repository Ekle:**
   - File → Add Local Repository
   - Klasör seç: `C:\Users\Mustafa\Desktop\DiniSohbet`
   - Add Repository

4. **Publish Repository:**
   - Sağ üstte "Publish repository" butonu
   - Name: dinisohbet
   - ✓ Public seç (ücretsiz deployment için)
   - Publish!

✅ **BITTI!** GitHub'a yüklendi!

---

## ✅ YÖNTEM 2: Personal Access Token (Manuel)

### 1. Token Oluştur:

1. GitHub.com'a git
2. Sağ üst → Settings (profil ayarları)
3. En altta → Developer settings
4. Personal access tokens → Tokens (classic)
5. Generate new token → Generate new token (classic)
6. Ayarlar:
   ```
   Note: DiniSohbet Deployment
   Expiration: No expiration (veya 90 days)
   Scopes:
     ✓ repo (tüm kutular)
     ✓ workflow
   ```
7. **Generate token**
8. **TOKEN'I KOPYALA** (bir daha gösterilmez!)
   - Örnek: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2. Git Credentials Güncelle:

**Credential Manager'ı Temizle:**
```bash
# Windows Credential Manager'da GitHub credential'ı sil
# Veya:
git credential reject
protocol=https
host=github.com

# Enter tuşuna iki kez bas
```

### 3. Tekrar Push Et:

```bash
git push -u origin main
```

**Kullanıcı adı iste geldiğinde:**
```
Username: sivriabbas
Password: ghp_xxxxxxxxxxxx (TOKEN'I YAPIŞTIR)
```

---

## 🎯 HANGİSİNİ SEÇMELİYİM?

### GitHub Desktop (Önerilen):
- ✅ En kolay
- ✅ Görsel arayüz
- ✅ Otomatik kimlik doğrulama
- ✅ 2 dakika

### Personal Access Token:
- Daha teknik
- Token yönetimi gerekli
- Terminal seviyorsanız

---

## 📝 SONRAKİ ADIMLAR (GitHub'a yüklendikten sonra)

### ADIM 2: MongoDB Atlas Kur

1. **mongodb.com/cloud/atlas** → Sign Up
2. **Create Free Cluster** (M0 - 512MB)
3. **Database Access** → Add User:
   ```
   Username: dinisohbet
   Password: (güçlü şifre oluştur - KAYDET!)
   ```
4. **Network Access** → Add IP Address:
   ```
   0.0.0.0/0 (Allow access from anywhere)
   ```
5. **Connect** → Drivers → Connection String:
   ```
   mongodb+srv://dinisohbet:SIFRENIZ@cluster0.xxxxx.mongodb.net/dinisohbet?retryWrites=true&w=majority
   ```
   **BU STRING'İ KAYDET!**

### ADIM 3: Render.com'da Deploy

1. **render.com** → Sign Up with GitHub
2. **New Web Service**
3. **Connect Repository:**
   - sivriabbas/dinisohbet seç
4. **Settings:**
   ```
   Name: dinisohbet
   Environment: Node
   Region: Frankfurt (EU Central)
   Branch: main
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```
5. **Environment Variables:**
   ```
   NODE_ENV = production
   PORT = 10000
   MONGODB_URI = (MongoDB connection string - Adım 2'den)
   SESSION_SECRET = (Generate butonuna tıkla)
   JWT_SECRET = (Generate butonuna tıkla)
   ```
6. **Create Web Service** → Deploy başlar!

---

## 🎉 SONUÇ

**Deployment tamamlandığında:**
- ✅ URL: https://dinisohbet.onrender.com
- ✅ 7/24 canlı
- ✅ Otomatik HTTPS
- ✅ Ücretsiz!

---

## 🐛 Sorun Çözme

### "Permission Denied" Hatası:
- GitHub Desktop kullanın (en kolay)
- Veya Personal Access Token oluşturun

### "Repository not found":
- GitHub'da repository oluşturulmuş mu kontrol edin
- sivriabbas/dinisohbet public mu?

### Token unutursam?
- Yeni token oluştur
- Eski token'ı iptal et (revoke)

---

**HANGİ YÖNTEMI SEÇTİNİZ?**

1. GitHub Desktop (önerilen) ✓
2. Personal Access Token (manuel)

Seçiminizi söyleyin, ona göre devam edelim! 🚀
