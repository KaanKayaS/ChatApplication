import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  name: string = "";

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    if (!this.name) {
      alert("Lütfen kullanıcı adınızı girin!");
      return;
    }

    // Önce localStorage'ı temizleyelim
    localStorage.clear();

    console.log("Giriş işlemi başlıyor:", this.name);

    this.http
      .get(`https://localhost:7162/api/Auth/Login?name=${this.name}`)
      .subscribe({
        next: (res: any) => {
          console.log("API yanıtı:", res);

          if (res && res.id) {
            try {
              // Kullanıcı bilgilerini JSON formatında saklayalım
              const userInfo = {
                id: res.id,
                name: res.name,
                avatar: res.avatar,
                status: res.status
              };
              
              localStorage.setItem("userInfo", JSON.stringify(userInfo));
              
              setTimeout(() => {
                this.router.navigate(['/home'])
                  .then((success) => {
                    if (success) {
                      console.log("Yönlendirme başarılı!");
                    } else {
                      console.error("Yönlendirme başarısız.");
                    }
                  })
                  .catch(error => {
                    console.error("Yönlendirme hatası:", error);
                  });
              }, 100);
            } catch (error) {
              console.error("Kullanıcı bilgileri kaydedilirken hata:", error);
              alert("Bir hata oluştu. Lütfen tekrar deneyin.");
            }
          } else {
            console.error("Kullanıcı bilgileri alınamadı. API yanıtı:", res);
            alert("Giriş başarısız. Lütfen tekrar deneyin.");
          }
        },
        error: (err) => {
          console.error("Giriş hatası:", err);
          alert("Giriş başarısız! Lütfen bilgilerinizi kontrol edin.");
        }
      });
  }
}
