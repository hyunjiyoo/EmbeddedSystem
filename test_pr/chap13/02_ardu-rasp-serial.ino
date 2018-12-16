#define EOT '$'
#define LED 13

char arr[100] = "";
int inchar, i = 0, used = 1;
char msg_res[100] = "";

void setup() {
    pinMode(LED, OUTPUT);
    Serial.begin(9600);
}

void Get_data_from_Fateway() {
    while (Serial.available() > 0) {
        inchar = Serial.read();
        arr[i] = (char)inchar;
        if (arr[i] == EOT)
            used = 0;
        i++;
}

void loop() {
    int k;
    Gate_data_from_Gateway();

    if(used == 0) {
        if (strcmp(arr, "11$") == 0) {
            strcpy(msg_res, "turn on");
            for(k=0; k < strlen(msg_res); k++)
                Serial.print(msg_res[k]);
            Serial.pintln("");
            digitalWrite(LED, HIGH);
        } else if (strcmp(arr, "12$") == 0) {
            strcpy(msg_res, "turn off");
            for(k=0; k < strlen(msg_res); k++)
                Serial.print(msg_res[k]);
            Serial.println("");
            digitalWrite(LED, LOW);
        }
        used = 1;
        i = 0;
        memset(arr, 0, 100);
    }
}