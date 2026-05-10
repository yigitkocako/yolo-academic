YOLO Academic — Ireland-only Build

Bu paket, önceki çok ülkeli yapıyı İrlanda odaklı hale getirir.

Öne çıkan değişiklikler:
- Kanada ve İngiltere içerikleri kaldırıldı.
- Menü güncellendi: Ana Sayfa / Hizmetlerimiz / Planını Oluştur / Yazılar / Hakkında.
- Ana sayfaya İrlanda odaklı 4 hizmet kartı eklendi: Üniversite, Dil Okulu, Lise, Yaşam & Kariyer.
- Ana sayfaya İrlanda odaklı süreç şeması eklendi.
- Finder artık ülke seçtirmiyor; İrlanda içinde eğitim türü, şehir, bütçe, IELTS ve hedefe göre çalışıyor.
- Results sayfası artık önerilen ülkeler yerine “Önerilen yollar” gösteriyor.
- README içindeki API key kaldırıldı. Eski key gerçekse rotate edilmelidir.
- Kesin ev adresi yerine “Dublin, Ireland” kullanıldı. İstersen şirket adresini sonra ekleyebilirsin.

Dosya yapısı:
- HTML dosyaları root klasörde
- CSS/JS/görseller: /assets
- JSON data: /data

Local test:
cd "BU_KLASOR"
python -m http.server 8000
http://localhost:8000

Deploy:
Netlify’a bu klasörü veya zip içeriğini yükleyebilirsin.


2026-05-10 mini revizyon:
- Marka alt metni “You Only Live Once!” yapıldı.
- Hizmet linkleri services.html sayfasının en üstüne yönlendirilecek şekilde sadeleştirildi.
- “Üniversite Danışmanlığı” başlığı “Lise / Üniversite Danışmanlığı” olarak güncellendi.
- Aşamalar metinleri genişletildi ve “Shortlist” yerine “Listeleme & Değerlendirme” kullanıldı.

v3 updates:
- Kullanıcının gönderdiği 8 yeni İrlanda görseli ana sayfa hero slider'a eklendi.
- Hero bölümünün altına hafif yamuk/diagonal fade geçiş efekti eklendi.
- Yeni görseller web için optimize edilmiş JPEG olarak assets klasörüne kaydedildi.
