<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Plugins Sample</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label position="floating">First Name</ion-label>
          <ion-input data-testid="firstName" v-model="firstName"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Last Name</ion-label>
          <ion-input data-testid="lastName" v-model="lastName"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>
            <ion-button
              data-testid="save"
              size="block"
              :disabled="!(firstName && lastName)"
              @click="save"
              >Save</ion-button
            >
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <ion-button data-testid="clear" size="block" @click="clear"
              >Clear</ion-button
            >
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <ion-button
              data-testid="hello"
              size="block"
              :disabled="!(firstName && lastName)"
              @click="sayHi"
              >Say HI!</ion-button
            >
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import { Storage } from "@capacitor/storage";
import { Toast } from "@capacitor/toast";

export default defineComponent({
  name: "Home",
  components: {
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
  },
  setup() {
    const keys = {
      firstName: "firstName",
      lastName: "lastName",
    };
    const firstName = ref("");
    const lastName = ref("");

    Storage.get({ key: keys.firstName }).then(
      ({ value }) => (firstName.value = value || "")
    );
    Storage.get({ key: keys.lastName }).then(
      ({ value }) => (lastName.value = value || "")
    );

    const clear = () => {
      firstName.value = "";
      lastName.value = "";
      Storage.clear();
    };

    const sayHi = () => {
      Toast.show({
        text: `Hello ${firstName.value} ${lastName.value}`,
      });
    };

    const save = () => {
      Storage.set({ key: keys.firstName, value: firstName.value });
      Storage.set({ key: keys.lastName, value: lastName.value });
    };

    return { firstName, lastName, clear, sayHi, save };
  },
});
</script>

<style scoped></style>
