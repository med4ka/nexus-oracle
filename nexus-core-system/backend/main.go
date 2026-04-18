package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	_ "modernc.org/sqlite"
)

type CryptoResponse struct {
	USD float64 `json:"USD"`
}

type AnalyticsData struct {
	Time  string  `json:"time"`
	Value float64 `json:"value"`
}

var currentCoin = "ETH"

func main() {
	db, err := sql.Open("sqlite", "./core_system.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	db.Exec("CREATE TABLE IF NOT EXISTS sys_metrics (id INTEGER PRIMARY KEY AUTOINCREMENT, time_str TEXT, value REAL)")

	r := gin.Default()
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type") // Wajib ditambahin buat nerima data JSON
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.GET("/api/core-stream", func(c *gin.Context) {
		rows, _ := db.Query("SELECT time_str, value FROM sys_metrics ORDER BY id DESC LIMIT 15")
		defer rows.Close()

		var results []AnalyticsData
		for rows.Next() {
			var d AnalyticsData
			rows.Scan(&d.Time, &d.Value)
			results = append(results, d)
		}

		for i, j := 0, len(results)-1; i < j; i, j = i+1, j-1 {
			results[i], results[j] = results[j], results[i]
		}
		c.JSON(200, results)
	})

	r.POST("/api/spike", func(c *gin.Context) {
		now := time.Now().Format("15:04:05")
		db.Exec("INSERT INTO sys_metrics (time_str, value) VALUES (?, ?)", now, 99999.99)
		c.JSON(200, gin.H{"status": "Spike injected"})
	})

	r.DELETE("/api/purge", func(c *gin.Context) {
		db.Exec("DELETE FROM sys_metrics")
		c.JSON(200, gin.H{"status": "Database wiped"})
	})

	r.POST("/api/set-coin", func(c *gin.Context) {
		type Request struct {
			Coin string `json:"coin"`
		}
		var req Request
		if err := c.BindJSON(&req); err == nil {
			currentCoin = req.Coin
			db.Exec("DELETE FROM sys_metrics") // Langsung Purge otomatis!
			fmt.Println("🔄 TARGET RADAR BERUBAH KE:", currentCoin)
			c.JSON(200, gin.H{"status": "Target locked to " + currentCoin})
		}
	})

	go func() {
		for {
			target := currentCoin
			url := fmt.Sprintf("https://min-api.cryptocompare.com/data/price?fsym=%s&tsyms=USD", target)
			resp, err := http.Get(url)

			if err == nil {
				var cryptoData CryptoResponse
				json.NewDecoder(resp.Body).Decode(&cryptoData)
				resp.Body.Close()

				now := time.Now().Format("15:04:05")
				db.Exec("INSERT INTO sys_metrics (time_str, value) VALUES (?, ?)", now, cryptoData.USD)
				fmt.Printf("💎 Live %s Price: $%.2f\n", target, cryptoData.USD)
			}
			time.Sleep(3 * time.Second)
		}
	}()

	fmt.Println("Nexus Oracle Backend running at http://localhost:9000")
	r.Run(":9000")
}
