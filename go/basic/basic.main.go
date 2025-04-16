// Basic samples to show & remain some syntax & abilities of GoLang
package main

import (
	"bufio"
	"fmt"
	"image"
	"image/color"
	"image/gif"
	"io"
	"io/ioutil"
	"math"
	"math/rand"
	"net/http"
	"os"
	"sync"
	"time"
)

func main() {
	fmt.Println("Hi there! This basic samples will show syntax & abilities of GoLang for u :)")
	fmt.Println("\nType option number marked by brackets in list below:")
	fmt.Println("1. Cycle, map, command line args, i/o")
	fmt.Println("[1.1] Echo - types provided command line arguments")
	fmt.Println("[1.2] Duplicate strings detector - types duplicate strings with repeats count")
	fmt.Println("2. Graphics")
	fmt.Println("[2.1] GIF-format animation")
	fmt.Println("3. HTTP requests")
	fmt.Println("[3.1] Single request (display content)")
	fmt.Println("[3.2] Multiple requests in parallel (summary only)")
	fmt.Println("4. HTTP server")
	fmt.Println("[4.1] Simple http-server")

	input := bufio.NewScanner(os.Stdin)
	if !input.Scan() {
		fmt.Println(StrAbortedByUser)
		os.Exit(1)
	}

	switch input.Text() {
	case "1.1":
		sample11AsEcho()
	case "1.2":
		sample12AsDuplicateStringsDetector()
	case "2.1":
		sample21AsGifAnimation()
	case "3.1":
		sample31AsSingleHttpRequest()
	case "3.2":
		sample32AsMultipleHttpRequestInParallel()
	case "4.1":
		sample41AsHttpServer()
	default:
		fmt.Println(StrIllegalOptionProvided)
	}
}

const StrAbortedByUser = "\nAborted by user ... bye!"
const StrIllegalOptionProvided = "\nIllegal option provided, exiting"

func sample11AsEcho() {
	arg := ""

	// cycle demo, use strings.Join(os.Args[1:], " ") instead to reduce costs
	for i := 1; i < len(os.Args); i++ {
		arg += os.Args[i] + " "
	}

	fmt.Printf("Hello, %v! %v\n", os.Args[0], arg)
}

func sample12AsDuplicateStringsDetector() {
	fmt.Println("\nType input kind: [s] - each line provided as string, [f] - each one as file")
	scanner := bufio.NewScanner(os.Stdin) // to simplify, we ignore errors here: scannerFile.Err()
	if !scanner.Scan() {
		fmt.Println(StrAbortedByUser)
		os.Exit(1)
	}

	flag := false
	if scanner.Text() == "s" {
	} else if scanner.Text() == "f" {
		flag = true
	} else {
		fmt.Println(StrIllegalOptionProvided)
		os.Exit(1)
	}

	strings := make(map[string]int)
	for scanner.Scan() {
		if flag {
			// every line is file name with string to be checked
			f, err := os.Open(scanner.Text())
			if err != nil {
				// fmt.Fprintf(os.Stderr, "dup2: %v\n", err)
				fmt.Printf("File '%v' opening error: %v\n", scanner.Text(), err)
				continue
			}
			scannerFile := bufio.NewScanner(f)
			for scannerFile.Scan() { // to simplify, we ignore errors here: scannerFile.Err()
				strings[scannerFile.Text()]++
			}
			err = f.Close()
			if err != nil {
				fmt.Printf("File '%v' closing error: %v\n", scanner.Text(), err)
			}
		} else {
			// every line is string to be checked
			strings[scanner.Text()]++
		}
	}

	flag = false
	for key, val := range strings {
		if val > 1 {
			if !flag {
				flag = true
				fmt.Println("\nThose strings aren't unique:")
			}
			fmt.Printf("%d\t%s\n", val, key)
		}
	}
	if !flag {
		fmt.Println("\nAll strings are unique")
	}
}

func sample21AsGifAnimation() {
	const fileName = "lassajous.gif"
	file, err := os.Create(fileName)
	if err != nil {
		fmt.Printf("\nFile creation error: %v\n, exiting", err)
		os.Exit(1)
	}

	sample21AsGifAnimationCore(file)

	err = file.Close()
	if err != nil {
		fmt.Printf("\nFile closing error: %v\n, exiting", err)
		os.Exit(1)
	}
	fmt.Printf("GIF-animated file '%s' sucessfully created, enjoy :)", fileName)
}

func sample21AsGifAnimationCore(w io.Writer) {
	var palette = []color.Color{color.Black, color.RGBA{G: 0xff, A: 0xff}}
	const (
		// colorIndexBack = 0     // 1-st palette color
		colorIndexMain = 1     // 2-nd palette color
		cycles         = 5     // Total oscillation count
		res            = 0.001 // Resolution degree
		size           = 86    // Image canvas,cover [size..+size] range (cool gifs with: 86, 91-93, 122, 130)
		nFrames        = 64    // Animation frames count
		delay          = 8     // Delay between frames
	)

	rand.Seed(time.Now().UTC().UnixNano())
	freq := rand.Float64() * 3.0 // relative frequency of 2-nd oscillator
	anim := gif.GIF{LoopCount: nFrames}
	phase := 0.0
	for i := 0; i < nFrames; i++ {
		rect := image.Rect(0, 0, 2*size+1, 2*size+1)
		img := image.NewPaletted(rect, palette)
		for t := 0.0; t < cycles*2*math.Pi; t += res {
			x := math.Sin(t)
			y := math.Sin(t*freq + phase)
			img.SetColorIndex(size+int(x*size+0.5), size+int(y*size+0.5), colorIndexMain)
		}
		phase += 1
		anim.Delay = append(anim.Delay, delay)
		anim.Image = append(anim.Image, img)
	}

	if err := gif.EncodeAll(w, &anim); err != nil {
		fmt.Printf("\nError occurs while encoding animation: %v\n, exiting", err)
		os.Exit(1)
	}
}

func sample31AsSingleHttpRequest() {
	fmt.Println("\nType some simple URL here, https://www.google.com for example:")
	scanner := bufio.NewScanner(os.Stdin)
	if !scanner.Scan() {
		fmt.Println(StrAbortedByUser)
		os.Exit(1)
	}

	resp, err := http.Get(scanner.Text())
	if err != nil {
		fmt.Printf("\nError occurs while fetching url data: %v\n, exiting", err)
		os.Exit(1)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("\nError occurs while reading HTML-body dataset: %v\n, exiting", err)
		os.Exit(1)
	}
	fmt.Println("\nHTML-body requested successfully, see answer content below:")
	fmt.Println()
	fmt.Printf("%s", body)

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			fmt.Printf("\nError occurs while closing HTML-body dataset: %v\n, exiting", err)
			os.Exit(1)
		} else {
			fmt.Println("\n\nHTML-body dataset closed successfully")
		}
	}(resp.Body)
}

func sample32AsMultipleHttpRequestInParallel() {
	fmt.Println("Enter some simple URLs bellow please (Ctrl+D will exit entering):")
	scanner := bufio.NewScanner(os.Stdin)
	start := time.Now()
	ch := make(chan string)
	hasUrl := false
	inputLen := 0

	for scanner.Scan() {
		if len(scanner.Text()) > 0 {
			hasUrl = true
			inputLen++

			go func(url string, ch chan<- string) {
				start := time.Now()
				resp, err := http.Get(url)
				if err != nil {
					ch <- fmt.Sprintf("\nError occurs while fetching url %s: %v\n, skipping", url, err)
					return
				}
				bytes, err := io.Copy(ioutil.Discard, resp.Body)
				if err != nil {
					ch <- fmt.Sprintf("\nError occurs while coping HTML-body data of url %s: %v\n, skipping", url, err)
					return
				}

				defer func(Body io.ReadCloser) {
					err := Body.Close()
					if err == nil {
						secs := time.Since(start).Seconds()
						ch <- fmt.Sprintf("%.2fs %7d %s", secs, bytes, url)
					} else {
						ch <- fmt.Sprintf("Error occurs while closing HTML-body dataset for url %s: %v\n", url, err)
					}
				}(resp.Body)
			}(scanner.Text(), ch)
		}
	}

	// If input was empty
	if !hasUrl {
		fmt.Println(StrAbortedByUser)
		os.Exit(1)
	}

	// If any url(s) provided, typing from channel (blocking queue)
	fmt.Println()
	for i := 0; i < inputLen; i++ {
		fmt.Println(<-ch)
	}

	// Print total info
	fmt.Printf("Total %.2fs elapsed\n", time.Since(start).Seconds())
}

func sample41AsHttpServer() {
	const port = "8000"
	fmt.Printf("Server listens %s port for those URLs:\n", port)
	fmt.Println("Any URL - diagnostic echo")
	fmt.Println("/gif - presents sample gif animation")
	fmt.Println("/count - presents total requests count from moment server been started")
	fmt.Println(".....")

	var mu sync.Mutex
	var count int

	dumpHeader := func(w http.ResponseWriter, r *http.Request) {
		if _, err := fmt.Fprintf(w, "%s %s %s\n", r.Method, r.URL, r.Proto); err != nil {
		}

		for k, v := range r.Header {
			if _, err := fmt.Fprintf(w, "Header[%q] = %q\n", k, v); err != nil {
			}
		}
		if _, err := fmt.Fprintf(w, "Host = %q\n", r.Host); err != nil {
		}
		if _, err := fmt.Fprintf(w, "RemoteAddr = %q\n", r.RemoteAddr); err != nil {
		}
		if err := r.ParseForm(); err != nil {
		}
		for k, v := range r.Form {
			if _, err := fmt.Fprintf(w, "Form[%q] = %q\n", k, v); err != nil {
			}
		}
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		mu.Lock()
		count++
		mu.Unlock()
		if _, err := fmt.Fprintf(w, "Echo URL.Path = %q\n", r.URL.Path); err != nil {
		}
		dumpHeader(w, r)
	})

	http.HandleFunc("/gif", func(w http.ResponseWriter, r *http.Request) {
		mu.Lock()
		count++
		mu.Unlock()
		sample21AsGifAnimationCore(w)
		// dumpHeader(w, r)
	})

	http.HandleFunc("/count", func(w http.ResponseWriter, r *http.Request) {
		mu.Lock()
		if _, err := fmt.Fprintf(w, "Total request count is %d", count); err != nil {
		}
		mu.Unlock()
	})

	if err := http.ListenAndServe(fmt.Sprintf("localhost:%s", port), nil); err != nil {
		fmt.Printf("\nError occurs while HTTP-server starting: %v\n, exiting", err)
	}
}
