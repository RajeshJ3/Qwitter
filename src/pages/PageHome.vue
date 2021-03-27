<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row q-col-gutter-md items-end">
        <div class="col">
          <q-input
        class="new-qweet"
        bottom-slots
        v-model="newQweetContent"
        placeholder="What's happening?"
        counter
        autogrow
        maxlength="280"
      >
          <template v-slot:before>
            <q-avatar
              size="xl"
            >
              <img src="https://avatars.githubusercontent.com/u/41537758">
            </q-avatar>
          </template>
        </q-input>
        </div>
        <div class="col col-shrink">
            <q-btn
            @click="addNewQweet"
            class="q-mb-lg" :disable="!newQweetContent" unelevated rounded color="primary" label="Qweet" no-caps />
        </div>
      </div>

      <q-separator size="10px" color="grey-2" class="divider" />

      <q-list separator>

        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item
          v-for="qweet in qweets"
          :key="qweet.id"
          class="qweet q-py-md"
          >
            <q-item-section avatar top>
              <q-avatar
                size="xl"
              >
                <img src="https://avatars.githubusercontent.com/u/41537758">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>
                Rajesh Joshi
                </strong>
                <span class="text-grey-7">
                  @rajesh_j3 
                  &bull; 
                  {{ qweet.date | relativeDate}}
                </span>
              </q-item-label>
              <q-item-label class="qweet-content text-subtitle1 q-pt-sm q-pb-md">{{ qweet.content }}</q-item-label>
              <div class="qweet-icons row justify-between">
                <q-btn
                  color="grey"
                  size="sm"
                  icon="far fa-comment"
                  flat
                  round
                />
                <q-btn
                  color="grey"
                  size="sm"
                  icon="fas fa-retweet"
                  flat
                  round
                />
                <q-btn
                  @click="toggleLiked(qweet)"
                  :color="qweet.liked ? 'pink': 'grey'"
                  size="sm"
                  :icon="qweet.liked ? 'fas fa-heart': 'far fa-heart'"
                  flat
                  round
                />
                <q-btn
                  @click="deleteQweet(qweet.id)"
                  color="grey"
                  size="sm"
                  icon="fas fa-trash"
                  flat
                  round
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>

      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import db from 'src/boot/firebase'
import { formatDistance } from 'date-fns'

export default {
  name: 'PageHome',
  data(){
    return {
      newQweetContent: "",
      qweets: []
    }
  },
  filters: {
    relativeDate(value){
      return formatDistance(value, new Date())
    }
  },
  methods:{
    addNewQweet(){
      let newQweet = {
        content: this.newQweetContent,
        date: Date.now(),
        liked: false,
      }
      db.collection('qweets').add(newQweet).then((docRef) => {
          console.log('Qweet Posted:', docRef.id);
      }).catch((error) => {
          console.error('Error:', error);
      });
      this.newQweetContent = ""
    },
    toggleLiked(qweet){
      return db.collection("qweets").doc(qweet.id).update({
          liked: !qweet.liked
      })
      .then(() => {
          console.log("Liked/Unliked");
      })
      .catch((error) => {
          console.error("Error", error);
      });


    },
    deleteQweet(id){
      db.collection('qweets').doc(id).delete().then(() => {
          console.log('Deleted!')
      }).catch((error) => {
          console.error('Error:', error)
      })
    }
  },
  mounted(){
    db.collection('qweets').orderBy('date', 'desc').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            let qweetChange = change.doc.data()
            qweetChange.id = change.doc.id
            if (change.type === 'added') {
              this.qweets.unshift(qweetChange)
            }
            if (change.type === 'modified') {
              let index = this.qweets.findIndex((qweet) => qweet.id === qweetChange.id)
              Object.assign(this.qweets[index], qweetChange)
            }
            if (change.type === 'removed') {
              this.qweets = this.qweets.filter((qweet) => qweet.id !== qweetChange.id)
          }
        });
    });
  }
}
</script>

<style lang="sass">
.new-qweet
  textarea
    font-size: 19px
    line-height: 1.4 !important

.divider
  border-top: 0.8px solid
  border-bottom: 0.8px solid
  border-color: $grey-4

.qweet:not(:first-child)
  border-top: 1px solid rgba(0, 0, 0, 0.12)

.qweet-content
  color: $grey-10
  line-height: 1.28 !important
  white-space: pre-line

.qweet-icons
  margin-left: -5px
</style>