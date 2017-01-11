package wiot

import (
	"fmt"

	"os"

	MQTT "github.com/eclipse/paho.mqtt.golang"
)

type WatsonIoT struct {
	Client MQTT.Client
	Topic  string
}

func getMqttOpts(url string, clientID string, username string, password string) *MQTT.ClientOptions {
	fmt.Printf("url: %s, clientID: %s, username: %s, password: %s", url, clientID, username, password)
	opts := MQTT.NewClientOptions().AddBroker(url)
	opts.SetClientID(clientID)
	opts.SetUsername(username)
	opts.SetPassword(password)
	opts.SetCleanSession(true) //Check
	return opts
}

func New(url string, topic string, clientID string, username string, password string) *WatsonIoT {
	opts := getMqttOpts(url, clientID, username, password)
	wiot := WatsonIoT{
		MQTT.NewClient(opts),
		topic,
	}
	return &wiot
}

func (wiot *WatsonIoT) Connect() {
	if token := wiot.Client.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}
	fmt.Println("App Client connected")
}

func (wiot *WatsonIoT) Subscribe(ch chan string) {
	if token := wiot.Client.Subscribe(wiot.Topic, 1, MakeMessageHandler(sayHello, ch)); token.Wait() && token.Error() != nil {
		fmt.Println(token.Error())
		fmt.Println("subscription error")
		os.Exit(1)
	}
}

func (wiot *WatsonIoT) Unsubscribe() {
	if token := wiot.Client.Unsubscribe(wiot.Topic); token.Wait() && token.Error() != nil {
		fmt.Println(token.Error())
		os.Exit(1)
	}
	fmt.Println("Unsubscribed")
}

func (wiot *WatsonIoT) Disconnect() {
	wiot.Client.Disconnect(250)
	fmt.Println("disconnected")
}

func MakeMessageHandler(fn func(MQTT.Client, MQTT.Message, chan string), ch chan string) MQTT.MessageHandler {
	return func(client MQTT.Client, msg MQTT.Message) {
		fn(client, msg, ch)
	}
}

func sayHello(client MQTT.Client, msg MQTT.Message, ch chan string) {
	payload := string(msg.Payload())
	fmt.Printf("the message is %s\n", payload)
	//fmt.Printf("the messsage is %s", msg.Payload())
	ch <- payload
}

func (wiot *WatsonIoT) Publish5Messages() {
	for i := 0; i < 5; i++ {
		token := wiot.Client.Publish(wiot.Topic, 1, false, `{"button":"like"}`)
		token.Wait()
	}
}
