# POSAVER Yönetici Paneli Rehberi

Panel adresi: **https://batuhankra.github.io/posaver/admin/**

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
| Fatma |                     | ☐ | ☐ | ☐ |
| Orhan |                     | ☐ | ☐ | ☐ |
| Ali   |                     | ☐ | ☐ | ☐ |

Biri ekipten ayrılırsa aynı sayfadan yetkisini kaldırın; panele girişi hemen biter.

---

## B. Her kişi için — ilk giriş (kendi hesabınızla, bir kez)

GitHub hesabı yoksa önce https://github.com/signup adresinden kendiniz açın.
Daveti kabul ettikten sonra:

1. GitHub'da sağ üstte profil resmi → **Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. **Generate new token (classic)**. Ad: `POSAVER panel`, süre: 90 gün.
3. Yalnızca **`public_repo`** kutusunu işaretleyin. **Generate token** deyin ve çıkan kodu kopyalayın
   (bir daha gösterilmez).
4. https://batuhankra.github.io/posaver/admin/ adresini açın → **Erişim Token'ı Kullanarak Giriş Yap** →
   kodu yapıştırın.

> "GitHub ile Giriş Yap" düğmesi bu kurulumda çalışmaz, token ile girin.
> Token sizin şifreniz gibidir: kimseyle paylaşmayın, mesaj/e-posta ile göndermeyin. Süresi dolunca 2. ve 3. adımları
> tekrarlayın. Şüphelenirseniz GitHub'da tokenı silin (**Delete**), giriş anında kapanır.

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
