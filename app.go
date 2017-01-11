package main

import (
	"encoding/json"
	"fmt"
	"log"
	"masterjulz/hhz-photon/config"
	"masterjulz/hhz-photon/wiot"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/websocket"
	//for extracting service credentials from VCAP_SERVICES
	//"github.com/cloudfoundry-community/go-cfenv"
)

const (
	DEFAULT_PORT = "8080"
)

var likeCount = 0
var dislikeCount = 0

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type Message struct {
	Type string `json:"type"`
	Data Data   `json:"data"`
}

type Data struct {
	Button string    `json:"button"`
	Count  int       `json:"count"`
	Time   time.Time `json:"time"`
}

func MakeHandler(fn func(http.ResponseWriter, *http.Request, chan string), ch chan string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fn(w, r, ch)
	}
}

func WSHandler(w http.ResponseWriter, r *http.Request, ch chan string) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	initCounts(conn)

	for {
		select {
		case res := <-ch:
			t := time.Now().UTC()
			var d Data
			b := []byte(res)
			err := json.Unmarshal(b, &d)

			switch d.Button {
			case "like":
				likeCount += 1
				d.Count = likeCount
				d.Time = t
				fmt.Println("likes", likeCount)
			case "dislike":
				dislikeCount += 1
				d.Count = dislikeCount
				d.Time = t
				fmt.Println("dislikes", dislikeCount)
			}

			err = conn.WriteJSON(Message{Type: "Photon", Data: d})
			if err != nil {
				log.Println(err)
				return
			}
		}
	}
}

func initCounts(conn *websocket.Conn) {
	err := conn.WriteJSON(Message{Type: "Photon", Data: Data{Button: "like", Count: likeCount}})
	if err != nil {
		log.Println(err)
		return
	}

	err = conn.WriteJSON(Message{Type: "Photon", Data: Data{Button: "dislike", Count: dislikeCount}})
	if err != nil {
		log.Println(err)
		return
	}
}

func main() {
	var port string
	if port = os.Getenv("PORT"); len(port) == 0 {
		port = DEFAULT_PORT
	}

	conf := config.Get()

	wiot := wiot.New(
		conf.Url,
		conf.Topic,
		conf.ClientID,
		conf.ApiKey,
		conf.AuthToken,
	)

	ch := make(chan string)
	wiot.Connect()
	go wiot.Subscribe(ch)

	fs := http.FileServer(http.Dir("public"))
	http.Handle("/", fs)
	http.HandleFunc("/ws", MakeHandler(WSHandler, ch))
	log.Printf("Starting app on port %+v\n", port)
	http.ListenAndServe(":"+port, nil)
}
