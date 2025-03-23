#include<stdio.h>
void activity(int idx[],int si[],int fi[],int n){
    for(int i=0;i<n;i++){
        if(fi[i]>fi[i+1]){
            int temp;
            temp=fi[i+1];
            fi[i+1]=fi[i];
            fi[i]=temp;

            temp=si[i+1];
            si[i+1]=si[i];
            si[i]=temp;

            temp=idx[i+1];
            idx[i+1]=idx[i];
            idx[i]=temp;
        }
    }
    int id1[n];
    int si1[n];
    int fi1[n];
    id1[0]=idx[0];
    si1[0]=si[0];
    fi1[0]=fi[0];
    int a=1;
    for(int i=1;i<n;i++){
        for(int j=i+1;j<n;j++){
            if(fi[i]<=si[j]){
                id1[a]=idx[i];
                fi1[a]=fi[i];
                si1[a]=si[j];
                a=a+1;                
            }
        }
    }

    
    for(int i=0;i<n;i++){
    printf("%d",idx[i]);
    }
    
    printf("\n");
    
    for(int i=0;i<n;i++){
        printf("%d",si[i]);
    }
    printf("\n");

    for(int i=0;i<n;i++){
        printf("%d",fi[i]);
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