import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { ChatModel } from '../../models/chat.model';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr'; 
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  users: UserModel[] = [];
  chats: ChatModel[] = [];
  selectedUserId: string = "";
  selectedUser: UserModel = new UserModel();
  user = new UserModel();
  hub : signalR.HubConnection | undefined;
  message: string ="";
constructor(
  private http: HttpClient,
  private router: Router
){
  const userInfoStr = localStorage.getItem("userInfo");
  if (!userInfoStr) {
    console.error("Kullanıcı bilgisi bulunamadı");
    this.logout();
    return;
  }

  try {
    this.user = JSON.parse(userInfoStr);
    this.getUsers();

    this.hub = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7162/chat-hub")
      .build();

    this.hub.start().then(()=> {
      console.log("Connection is started...");
      this.hub?.invoke("Connect", this.user.id);

      this.hub?.on("Users", (res:UserModel) => {
        console.log(res);
        const userToUpdate = this.users.find(p => p.id == res.id);
        if (userToUpdate) {
          userToUpdate.status = res.status;
        }
      });

      this.hub?.on("Messages", (res:ChatModel) => {
        console.log(res);
        if(this.selectedUserId == res.userId){
          this.chats.push(res); 
        }
      });
    }).catch(error => {
      console.error("SignalR bağlantı hatası:", error);
    });
  } catch (error) {
    console.error("Kullanıcı bilgisi parse hatası:", error);
    this.logout();
  }
}

  getUsers(){
     this.http.get<UserModel[]>("https://localhost:7162/api/Chats/GetUsers").subscribe(res => {
      this.users = res.filter(p =>p.id != this.user.id);
     })
  }


  changeUser(user: UserModel){
    this.selectedUserId = user.id;
    this.selectedUser = user;

    this.http.get(`https://localhost:7162/api/Chats/GetChats?userId=${this.user.id}&toUserId=${this.selectedUserId}`)
    .subscribe((res:any)=> { 
      this.chats = res;
    })
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  sendMessage(){
    const data ={
        "userId": this.user.id,
        "toUserId": this.selectedUserId,
        "message": this.message   
    }
    this.http.post<ChatModel>("https://localhost:7162/api/Chats/SendMessage",data).subscribe((res) => {
    this.chats.push(res);
    this.message ="";
    });
  }

}







