import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterModel } from '../../models/register.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerModel: RegisterModel = new RegisterModel();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  setImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü (örneğin 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu çok büyük! Maksimum 5MB olmalıdır.');
        return;
      }
      this.registerModel.file = file;
    }
  }

  register() {
    if (!this.registerModel.name || !this.registerModel.file) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.registerModel.name);
    formData.append('file', this.registerModel.file);

    this.http.post("https://localhost:7162/api/Auth/Register", formData)
      .subscribe({
        next: (res: any) => {
          if (res && res.id) {
            // Kullanıcı bilgilerini JSON formatında saklayalım
            const userInfo = {
              id: res.id,
              name: res.name,
              avatar: res.avatar,
              status: 'online'
            };
            
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            this.router.navigate(['/home']);
          } else {
            console.error('Beklenmeyen API yanıtı:', res);
            alert('Kayıt işlemi başarısız! Lütfen tekrar deneyin.');
          }
        },
        error: (err) => {
          console.error('Kayıt hatası:', err);
          if (err.status === 400) {
            alert('Geçersiz kayıt bilgileri! Lütfen bilgilerinizi kontrol edin.');
          } else {
            alert('Kayıt işlemi sırasında bir hata oluştu! Lütfen tekrar deneyin.');
          }
        }
      });
  }
}
