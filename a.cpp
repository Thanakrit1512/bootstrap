#include<stdio.h>
#include<sys/socket.h>
#include<sys/types.h>
#include<netinet/in.h>
#define ServerAddr "18.138.77.89"
#define ServerPort 9000
int main(int argc,char* argv[]){
int sockfd;
struct sockaddr_in serveraddr;
char buf[100];
bzero((char*)&serveraddr,sizeof(serveraddr));
serveraddr.sin_family=AF_INET;
serveraddr.sin_addr.s_addr=inet_addr(ServerAddr);
serveraddr.sin_port=htons(ServerPort);
if ( (sockfd=socket(AF_INET,SOCK_STREAM,0))<0){
fprintf(stderr,"Can not create Socket");
exit(1);
}
if (connect(sockfd,(struct sockaddr*)&serveraddr,sizeof(serveraddr))<0){
fprintf(stderr,"Can not connet to server");
exit(1);
}
write(sockfd,argv[0],strlen(argv[0]));
read(sockfd,buf,sizeof(buf));
close(sockfd);
exit(0);
}