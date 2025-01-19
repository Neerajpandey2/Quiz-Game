
// making all the unnecessary divs invisible initially and visible only when then actually needs.
    document.querySelector('#thirdj').style.display = 'none';
    document.querySelector('#secondj').style.display = 'none';
    document.querySelector('#firstj').style.display = 'block';
    document.querySelector('#fourthj').style.display = 'none';
    
    let start = document.querySelector('#start');
    let ctValue;
    let leValue;

    // adding click event on the start button 
    start.addEventListener('click', () => {
      start.disabled = true;

      let categoryValue = document.querySelector('#floatingSelect').value;
      let levelValue = document.querySelector('#floatingSelect2').value;


    // checking the category and level selected before start or not
      if (categoryValue === 'category' || levelValue === 'level') {

        let alert = document.querySelector('.alert');
        alert.classList.add('show');

        setTimeout(() => {
          alert.classList.remove('show');
        }, 3000);

        start.disabled = false;
        return;

      }
      else {
    // setting the selected category and level in the ctValue and leValue which we will insert in api  
        ctValue = categoryValue;
        leValue = levelValue;
      }


    // fetching data by this api
      fetch(`https://opentdb.com/api.php?amount=10&category=${ctValue}&difficulty=${leValue}&type=multiple`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`there is a problem! perhaps the server is down. ${response.status}`)
          }
          return response.json();
        })
        .then(data => {

          let total = 10;
          let questionNo;
          let timer;

          let i = 0;
          let score = 0;
          let correctAns;
          let allQuesAns = [];

          clearInterval(timer);
          count();
          loadq(i);





        // using this function for run countdown using set interval
          function count() {
            let j = 14;
            timer = setInterval(() => {
              if (j > 0) {
                let countdownNo = document.querySelector('#countdown');
                countdownNo.innerText = j;
                j--;
              }
              else {
                clearInterval(timer);
                i++;
                count();
                loadq(i);


              }
            }, 1000);
            document.querySelector('#countdown').innerText = '15';
          }


        // loading all the question one by one in secondj div
          function loadq(i) {
            if (i < data.results.length) {
              questionNo = i + 1;
              document.querySelector('#secondj').style.display = 'block';
              document.querySelector('#firstj').style.display = 'none';
              document.querySelector('#qnumber').innerText = `${questionNo}`;
              updateProgress(questionNo, total) 
              let radios = document.querySelectorAll('input[type=radio]');
              radios.forEach((values) => {
                values.checked = false;
                values.blur(); // Remove the focus from the radio button
              });

              /* here i used decode() function and below i wrote a function for decode the given data like sometimes the data we got find it like &quotMonkey&quot which means "Monkeys", so we have to decode this by DomParser or textArea.*/
              let question = decode(data.results[i].question);
              correctAns = decode(data.results[i].correct_answer);
              let option1 = decode(data.results[i].incorrect_answers[0]);
              let option2 = decode(data.results[i].incorrect_answers[1]);
              let option3 = decode(data.results[i].incorrect_answers[2]);
              let option4 = decode(data.results[i].correct_answer);

              allQuesAns.push({ question: question, answer: correctAns });

              let optionArray = [option1, option2, option3, option4];
              optionArray.sort(() => Math.random() - 0.5);  // suffle the array element randomly


              let options = document.querySelectorAll('label');
              options.forEach(function (option) {
                document.querySelector('#questions').innerText = question;
                document.querySelector('#option1').innerText = optionArray[0];
                document.querySelector('#option2').innerText = optionArray[1];
                document.querySelector('#option3').innerText = optionArray[2];
                document.querySelector('#option4').innerText = optionArray[3];


              })


            }
            else {
              clearInterval(timer);
              document.querySelector('#score').innerText = score;
              document.querySelector('#secondj').style.display = 'none';
              document.querySelector('#thirdj').style.display = 'block';
            }

          }

          //decoding function which decode the encoded text in the api json data
          function decode(data) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(data, 'text/html');
            decoded = doc.documentElement.textContent;
            return decoded;

          }

          // restart button
          let restart = document.querySelectorAll('.restart');
          restart.forEach((all) => {
            all.addEventListener('click', () => {

              clearInterval(timer); // Ensure any ongoing countdown is clear
              document.querySelector('#firstj').style.display = 'block';
              document.querySelector('#secondj').style.display = 'none';
              document.querySelector('#thirdj').style.display = 'none';
              document.querySelector('#fourthj').style.display = 'none';
              start.disabled = false;
              score = 0;

            })
          });

        // skip button
          let skip = document.querySelector('.skip');
          skip.addEventListener('click', () => {
            clearInterval(timer);
            i++;
            count();
            loadq(i);
          })

        //  see answer button
          let allanswer = document.querySelector('.checkAns');
          allanswer.addEventListener('click', () => {
            document.querySelector('#fourthj').style.display = 'block';
            allQuesAns.forEach((values, index) => {
              let div = document.querySelector('#ques');
              let newh = document.createElement('h5');
              newh.innerHTML = ' ';
              newh.innerHTML = `<p> <strong> ${index + 1}Q. </strong>${values.question}<p> <strong> Ans.  </strong> ${values.answer}  <hr>`;
              div.appendChild(newh);
              newh.style.textAlign = "start";


            })
          })


          let useranswer = document.querySelectorAll('input[type=radio]');
          useranswer.forEach((value) => {
            value.addEventListener('change', (event) => {
              let label = document.querySelector(`label[for="${event.target.id}"]`).innerText;
              if (label === correctAns) {
                clearInterval(timer);
                i++;
                score++;
                count();
                loadq(i);
              }
              else {
                clearInterval(timer);
                i++;
                count();
                loadq(i);

              }
            })
          })

        })
       .catch(error => {
       throw new Error(`There is a problem in the site now / check your internet connection : ${error.message || error}`);
    
      });

     })

    // this is the simple way to redirect user to the gamil with pre-filled email
    function sendMail() {
    const email = "np8650335794@gmail.com";
    const subject = "Hello from Quiz Game!";
    const body = "I would like to discuss...";
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    // this code is for progress bar which progress according to question no
    function updateProgress(questionNo, total) {
      const progressBar = document.getElementById('progress-bar');
      const progress = (questionNo / total) * 100; // Calculate the progress percentage
      progressBar.style.width = progress + '%'; // Update the width of the progress bar
      progressBar.setAttribute('aria-valuenow', progress); // Update ARIA value for accessibility
    }

    /* 
    we can decode encoded string by this also(textarea) and also by DOMParser above i used p DOMParser method--
    
                function chng(question){
                          let textarea = document.createElement('textarea');
                          textarea.innerHTML = question;
                          console.log(textarea.value)
    
                      }
    */
    