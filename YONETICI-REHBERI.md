# POSAVER Yönetici Paneli Rehberi

Panel adresi: **https://posaver.com/admin/**
Giriş yönergesi (token bağlantısıyla): **https://posaver.com/yonetici/**, sitenin en altındaki "Yönetici girişi" bağlantısından da açılır.

Panelden blog yazıları eklenir, düzenlenir, taslağa alınır ve silinir. Yayınla'ya basılan değişiklik repoya
kişinin kendi GitHub adıyla kaydolur ve site 1–2 dakika içinde kendiliğinden güncellenir.

Yetkili kişiler: **Fatma, Orhan, Ali** (üçü de tam yetkili: yazıyı doğrudan yayınlayabilir).

---

## A. Repo sahibi için (BatuhanKra) — her kişi için bir kez

Her kişiyi **tek tek** ekleyin:

1. https://github.com/BatuhanKra/posaver/settings/access sayfasını açın.
2. **Add people** ile kişinin GitHub kullanıcı adını yazın, rol olarak **Write** seçin, daveti gönderin.
3. Kişi e-postasındaki daveti kabul edince yetkisi başlar.

| Kişi | GitHub kullanıcı adı | Davet gönderildi | Kabul etti | Token oluşturdu |
|------|----------------------|:----------------:|:----------:|:---------------:|
| Fatma | fatmanurdogannn     | ☐ | ☐ | ☐ |
| Orhan | OrhanBilgin0        | ☐ | ☐ | ☐ |
| Ali   | acmak18-lang        | ☐ | ☐ | ☐ |

Biri ekipten ayrılırsa aynı sayfadan yetkisini kaldırın; panele girişi hemen biter.

---

## B. Her kişi için — ilk giriş (kendi hesabınızla, bir kez)

GitHub hesabı yoksa önce https://github.com/signup adresinden kendiniz açın.

1. GitHub'dan gelen **daveti kabul edin** (e-posta ya da https://github.com/BatuhanKra/posaver/invitations).
2. https://posaver.com/admin/ adresini açın → **GitHub ile Giriş Yap** → GitHub'da giriş yapıp **Authorize** deyin.

Panel arka planda `auth.posaver.com` (Cloudflare Worker, kodu `workers/auth/` klasöründe) üzerinden giriş yapar.

**Giriş çalışmazsa (yedek yöntem): token ile giriş**
1. https://posaver.com/yonetici/ sayfasındaki **token ile girin** bölümünü açıp GitHub token sayfasını açın
   (ayarlar hazır dolu gelir), süreyi 90 gün seçip **Generate token** deyin, kodu kopyalayın.
2. Panelde **Erişim Token'ı Kullanarak Giriş Yap** → kodu yapıştırın.

> Token sizin şifreniz gibidir: kimseyle paylaşmayın, mesaj/e-posta ile göndermeyin.
> Şüphelenirseniz GitHub'da tokenı silin (**Delete**), giriş anında kapanır.

---

## C. Günlük kullanım

**Yeni yazı:** sol menüde **Blog yazıları → Yeni Blog yazısı**. Başlık, kısa özet, tarih ve içeriği doldurun.
İçerikte görsel eklemek için araç çubuğundaki görsel simgesini kullanın.

**Taslak:** *Taslak* anahtarını açık bırakıp kaydederseniz yazı sitede görünmez. Hazır olunca kapatıp yayınlayın.
(Not: repo herkese açık olduğundan taslak dosyası GitHub'da görülebilir, sitede görünmez.)

**Yayınla:** sağ üstteki **Yayınla** düğmesi. 1–2 dakika sonra sitede görünür; durumu
https://github.com/BatuhanKra/posaver/actions sayfasından izleyebilirsiniz.

**Silme / geri alma:** silinen yazı repoda geçmişte durur; Batuhan geri getirebilir.

---

## D. Sık sorulanlar

- **"Kayıt yetkiniz yok / 403" hatası:** davet kabul edilmemiş ya da token'da `public_repo` işaretli değildir.
- **Yayınladım ama sitede yok:** Actions sayfasında yayın çalışması bitmeden bekleyin, sonra sayfayı Ctrl+F5 ile yenileyin.
- **İki kişi aynı yazıyı düzenlerse** sonra kaydeden, öncekinin değişikliklerinin üzerine yazabilir; aynı yazıda
  birlikte çalışmayın.
- **Tüm sitenin metinleri (ana sayfa bölümleri)** panelden değişmez, onlar için Batuhan'a yazın.
