# Dini Sohbet Platformu

İslami paylaşımlar, dualar ve sohbet platformu. Kullanıcılar dini içerikler paylaşabilir, dualar ekleyebilir ve birbirleriyle etkileşim kurabilir.

## 🌟 Özellikler

### Kullanıcı Yönetimi
- Üye kayıt ve giriş sistemi
- Kullanıcı profilleri
- Profil düzenleme

### Paylaşım Sistemi
- Dini içerik paylaşımı
- Kategorilere göre filtreleme (Genel, Dua, Hadis, Ayet, Sohbet, Soru-Cevap, Hikaye)
- Arama özelliği
- Beğeni ve yorum yapma
- Etiketleme sistemi

### Dua Koleksiyonu
- Arapça metin, okunuş ve anlamı ile dualar
- Kategorilere göre dua listesi (Sabah, Akşam, Yemek, Yolculuk, vb.)
- Favorilere ekleme
- Paylaşım özelliği

### Etkileşim Özellikleri
- Paylaşımları beğenme
- Yorum yapma
- Dualara favori ekleme
- Görüntüleme sayıları

## 📋 Gereksinimler

- Node.js (v14 veya üzeri)
- MongoDB (v4.4 veya üzeri)
- npm veya yarn

## 🚀 Kurulum

### 1. Depoyu İndirin veya Klonlayın

```bash
cd DiniSohbet
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. MongoDB'yi Başlatın

MongoDB'nin bilgisayarınızda çalıştığından emin olun. Windows'ta:

```bash
# MongoDB servisini başlatın (Yönetici olarak CMD)
net start MongoDB
```

Alternatif olarak MongoDB Compass'ı kullanabilir veya MongoDB Atlas (bulut) kullanabilirsiniz.

### 4. Environment Değişkenlerini Ayarlayın

`.env` dosyası zaten oluşturulmuştur. Gerekirse düzenleyin:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/dinisohbet
SESSION_SECRET=dini-sohbet-gizli-anahtar-2025
JWT_SECRET=jwt-dini-sohbet-gizli-anahtar-2025
NODE_ENV=development
```

### 5. Uygulamayı Başlatın

Geliştirme modu (otomatik yeniden başlatma ile):
```bash
npm run dev
```

Veya normal mod:
```bash
npm start
```

### 6. Tarayıcıda Açın

Tarayıcınızda şu adresi açın:
```
http://localhost:3000
```

## 📁 Proje Yapısı

```
DiniSohbet/
├── models/              # Veritabanı modelleri
│   ├── User.js         # Kullanıcı modeli
│   ├── Post.js         # Paylaşım modeli
│   └── Dua.js          # Dua modeli
├── routes/             # API route'ları
│   ├── auth.js         # Kimlik doğrulama
│   ├── posts.js        # Paylaşım işlemleri
│   ├── duas.js         # Dua işlemleri
│   └── users.js        # Kullanıcı işlemleri
├── views/              # EJS şablonları
│   ├── auth/           # Giriş/Kayıt sayfaları
│   ├── posts/          # Paylaşım sayfaları
│   ├── duas/           # Dua sayfaları
│   ├── users/          # Kullanıcı sayfaları
│   ├── partials/       # Yeniden kullanılabilir bileşenler
│   └── index.ejs       # Ana sayfa
├── public/             # Statik dosyalar
│   ├── css/           # CSS dosyaları
│   ├── js/            # JavaScript dosyaları
│   └── images/        # Görseller
├── server.js          # Ana sunucu dosyası
├── package.json       # Proje bağımlılıkları
└── .env              # Ortam değişkenleri
```

## 🎨 Kategoriler

### Paylaşım Kategorileri
- **Genel**: Genel dini paylaşımlar
- **Dua**: Dualar ve dua ile ilgili içerikler
- **Hadis**: Hadis-i Şerifler
- **Ayet**: Kuran-ı Kerim ayetleri
- **Sohbet**: Dini sohbetler ve vaazlar
- **Soru-Cevap**: Dini sorular ve cevapları
- **Hikaye**: İbret verici hikayeler

### Dua Kategorileri
- **Sabah**: Sabah duaları
- **Akşam**: Akşam duaları
- **Yemek**: Yemek duaları
- **Yolculuk**: Yolculuk duaları
- **Hasta**: Hasta ziyareti duaları
- **Tesbihat**: Tesbihatlar
- **Genel**: Genel dualar

## 👥 Kullanıcı Rolleri

- **User (Kullanıcı)**: Normal kullanıcılar, paylaşım ve dua ekleyebilir
- **Moderator (Moderatör)**: İçerikleri onaylayabilir
- **Admin (Yönetici)**: Tam yetki

## 🔒 Güvenlik

- Şifreler bcrypt ile hashlenir
- Session tabanlı kimlik doğrulama
- XSS koruması
- Input validasyonu

## 🛠️ Teknolojiler

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- EJS (Template Engine)
- Express Session
- Bcrypt.js

### Frontend
- HTML5
- CSS3 (Modern, Responsive)
- Vanilla JavaScript
- Font Awesome Icons

## 📝 Kullanım

### Yeni Kullanıcı Kaydı
1. "Kayıt Ol" butonuna tıklayın
2. Kullanıcı adı, email ve şifre bilgilerinizi girin
3. Hesabınız oluşturulacak ve otomatik giriş yapılacaktır

### Paylaşım Yapma
1. Giriş yaptıktan sonra "Yeni Paylaşım" butonuna tıklayın
2. Başlık, kategori ve içerik bilgilerini girin
3. İsteğe bağlı etiketler ekleyin
4. "Paylaş" butonuna tıklayın

### Dua Ekleme
1. "Dualar" sayfasına gidin
2. "Dua Ekle" butonuna tıklayın
3. Dua başlığı, Arapça metin, okunuş ve anlamını girin
4. Kategori seçin ve kaynak ekleyin (opsiyonel)
5. "Duayı Ekle" butonuna tıklayın

## 🚧 Geliştirme Planları

- [ ] Kullanıcı avatar yükleme
- [ ] Gelişmiş arama filtreleri
- [ ] Bildirim sistemi
- [ ] Email doğrulama
- [ ] Şifre sıfırlama
- [ ] Sosyal medya paylaşımı
- [ ] Mobil uygulama
- [ ] Dark mode
- [ ] Çoklu dil desteği

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/YeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/YeniOzellik`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📧 İletişim

Sorularınız için: info@dinisohbet.com

## 🙏 Teşekkürler

Bu platformu kullandığınız için teşekkür ederiz. Allah kabul etsin.
