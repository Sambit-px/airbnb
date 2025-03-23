#include<stdio.h>
void activity(int idx[],int si[],int fi[],int n){
    for(int i=0;i<n;i++){
        for(int j=i;j<n;j++){
            if(fi[i]>fi[j]){
                int temp;
                int tem;
                int te;
                temp=fi[j];
                fi[j]=fi[i];
                fi[i]=temp;
    
                tem=si[j];
                si[j]=si[i];
                si[i]=tem;
    
                te=idx[j];
                idx[j]=idx[i];
                idx[i]=te;
            }
        }
    }

    printf("%d",idx[0]);
    int a=1;
    int j=0;
    for(int i=j;i<n;i++){
         if(fi[j]<=si[i]){
            printf("\t%d",idx[i]);
            a=a+1;  
            j=i;
        }
    }
}

int main() {
    int idx[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11};
    int si[] = {1, 3, 0, 6, 0, 3, 5, 5, 8, 8, 12}; 
    int fi[] = {4, 5, 10, 6, 8, 7, 9, 12, 11, 14, 13};

    int n = sizeof(fi) / sizeof(fi[0]); 
    activity(idx, si, fi, n);
    
    return 0;
}