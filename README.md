# ChatAppClient
Projem backendi .Net 8.0 ile yapılmış , frontendi Angular kullanılarak yapılmıştır. Backend tarafında SignalR kullanılarak canlı mesajlaşma ve kullanıcıların online olma
durumu Real Time bir şekilde gözükmektedir. Kullanıcı girişi yaparak farklı clientler üzerinden mesajlaşma imkanı sunan bir uygulama.


---------------------------YAPILMASI GEREKENLER--------------------------
1-appsettings.json içindeki connection string MsSql' e göre yapılmıştır kendi connection stringinizle değiştirip migration oluşturup
update-database yapmanız gerekmektedir.(Initial Catolog' da dbnin ismidir.)
2- Program.cs tarafında 

builder.Services.AddCors(action =>
{
    action.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    });
});

bu urli kendi frontend Urlnizle değiştirmeniz gerkmektedir.

3- Angular projesini ayağa kaldırırken API' nin ayağa kalktığından emin olun


------------------------KURULMASI GEREKEN PAKETLER-------------------------------
1-Microsoft.Entity.FrameworkCore.SqlServer
2-Microsoft.Entity.FrameworkCore.Tools
3-TS.FileService
4-node
5-npm
6-Angular projesine SignalR Kurulmalıdır.
