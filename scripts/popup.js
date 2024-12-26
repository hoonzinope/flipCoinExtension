const const_coinFrames = ["🌑","🌗","🌕","🌓","🌘","🌒"];
const hand = "👍";
const correct = "👍";
const sorry = "👎";
const results = ["HEAD", "TAIL"];
let animationInterval;

const currentPointDisplay = document.getElementById("current-point");
const betInput = document.getElementById("bet-input");
const headButton = document.getElementById("headButton");
const tailButton = document.getElementById("tailButton");
const flipButton = document.getElementById("flipButton");
const resultDiv = document.getElementById("result");
const betButtonsContainer = document.getElementById("bet-buttons-container");
const gameContainer = document.getElementById("game-container");
const pointArea = document.getElementById("point-area");
const betPointContainer = document.getElementById("bet-point-container");
const moreCoinContainer = document.getElementById("more-coin-container");

const coinGame = {
    userBet : null,
    selectedButton : null,
    gameResult : null,
    currentPoint : null,
    init : function() {
        coinGame.currentPoint = coinGame.initialCurrentPoint(coinGame.getPoint()); // 초기 point 설정
        coinGame.currentPoint = Number(coinGame.currentPoint);

        // 초기 point 표시
        currentPointDisplay.textContent = Number(coinGame.currentPoint);

        coinGame.zeroPoint();

        // button listener
        coinGame.addButtonListener();
    },
    initialCurrentPoint : function(point) {
        if(point != undefined && !isNaN(point))
            return point;
        else{
            coinGame.setPoint(0);
            return 0;
        }
    },
    animateCoinFlip : function() {
        if(this.userBet == null) {
            resultDiv.textContent = "head or tail ?";
            return;
        }

        if(coinGame.currentPoint == 0){
            resultDiv.textContent = "no coin";
            return;
        }

        let betAmount = parseInt(betInput.value, 10); // 걸 point 가져오기
        if(isNaN(betAmount) || betAmount < 1){
            resultDiv.textContent = "bet error";
            return;
        }
        if(betAmount > coinGame.currentPoint){
            resultDiv.textContent = "not enough";
            return;
        }



        coinGame.hideBoard();

        // 게임 컨테이너 높이에 따라 coinFrames 개수 동적 조정
        const containerHeight = gameContainer.clientHeight;
        const frameCount = 8; //Math.floor(containerHeight / 40); // 예: 높이 200px 당 10개 프레임
        let coinFrames = Array(frameCount).fill(""); // 동적으로 coinFrames 생성
        coinFrames = const_coinFrames;
        let coinY = frameCount;// Math.floor(frameCount / 2);
        let frameIndex = 0;
        let isAscending = true;

        resultDiv.textContent = "";

        animationInterval = setInterval(() => {
            let output = "";
            for (let i = 0; i < coinY; i++) {
                output += "\n";
            }
            output += "" + coinFrames[frameIndex];
            for (let i = 0; i < frameCount - coinY; i++) {
                output += "\n";
            }
            output += "" + hand;
            resultDiv.textContent = output;

            if (isAscending) {
                coinY--;
                frameIndex++;
                if (frameIndex === coinFrames.length) {
                    frameIndex = coinFrames.length-1;// - 2;
                    isAscending = false;
                }
            } else {
                coinY++;
                frameIndex--;
                if (frameIndex < 0) {
                    clearInterval(animationInterval);
                    coinGame.displayResult();
                    return;
                }
            }
        }, 50);
    },
    showBoard : function(){
        betButtonsContainer.style.display = "flex";
        flipButton.style.display = "block";
        pointArea.style.display = "block";
        betPointContainer.style.display = "block";
    },
    hideBoard : function() {
        betButtonsContainer.style.display = "none";
        flipButton.style.display = "none";
        pointArea.style.display = "none";
        betPointContainer.style.display = "none";
    },
    zeroPoint : function() {
        let currentPoint = coinGame.currentPoint;
        if(currentPoint <= 0) {
            betPointContainer.style.display = "none";
            moreCoinContainer.style.display = "block";
        }else{
            betPointContainer.style.display = "block";
            moreCoinContainer.style.display = "none";
        }
    },
    displayResult : function() {
        let betAmount = parseInt(betInput.value, 10); // 걸 point 가져오기
        let currentPoint = coinGame.currentPoint;
        
        coinGame.gameResult = results[Math.floor(Math.random() * results.length)]; // 결과를 변수에 저장
        coinGame.displayText(coinGame.gameResult);
        
        currentPoint = coinGame.calculatePoint(betAmount, coinGame.gameResult);
        currentPointDisplay.textContent = currentPoint; // 현재 point 업데이트
        coinGame.setPoint(currentPoint);
        
        coinGame.showBoard();
        coinGame.deselectBet();
        coinGame.zeroPoint();
    },
    calculatePoint : function(betAmount, gameResult) {
        let currentPoint = coinGame.currentPoint;
        let userBet = coinGame.userBet;

        if (userBet === gameResult) {
            const earnedPoints = betAmount * 2;
            currentPoint += earnedPoints;
        } else {
            currentPoint -= betAmount;
        }
        return currentPoint;
    },
    displayText : function(gameResult) {
        let output = "";
        let userBet = coinGame.userBet;

        if (userBet === gameResult) {
            output += "" + gameResult;
            output += " :) " + correct; // 정답 메시지 추가
        } else {
            output += "" + gameResult;
            output += " ;( " + sorry; // 오답 메시지 추가
        }
        resultDiv.textContent = output;
    },
    selectBet : function(bet, button) {
        if (coinGame.selectedButton) {
            coinGame.selectedButton.classList.remove("selected");
        }
        coinGame.userBet = bet;
        coinGame.selectedButton = button;
        coinGame.selectedButton.classList.add("selected");
    },
    deselectBet : function() {
        if(coinGame.selectedButton){
            coinGame.selectedButton.classList.remove("selected");
        }
        coinGame.userBet = null;
        coinGame.selectedButton = null;
    },
    addButtonListener : function() {
        headButton.addEventListener("click", () => {
            coinGame.selectBet("HEAD", headButton);
        });
        
        tailButton.addEventListener("click", () => {
            coinGame.selectBet("TAIL", tailButton);
        });
        
        flipButton.addEventListener("click", () => {
            coinGame.animateCoinFlip();
        });

        moreCoinContainer.addEventListener("click", () => {
            let currentPoint = Number(coinGame.getPoint());
            let addPoint = 100;
            console.log("moreCoin");
            coinGame.setPoint(currentPoint + addPoint);
            location.reload();
        })
    },
    getPoint : function() {
        return localStorage.getItem("flipPoint"); 
    },
    setPoint : function(point) {
        coinGame.currentPoint = point;
        localStorage.setItem("flipPoint", point);
  
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("flip the coin");
    coinGame.init();
});
