// 	1. Start 버튼을 누르면 시작
// 	2. 10초후 게임 자동 종료
// 	3. 포로리의 좌표는 랜덤
// 		x : 99, 295, 660, 877
// 		y : 320, 400, 458, 640

// 	4. 포로리를 클릭하면 점수획득
// 	5. 포로리 이동시간은 사용자 입력

// 	score = 0;// 점수
// 	intervalID = null; //게임 타이머
	
$(function(){
    const $btnStart = $("button");
    
    const $prr = $(".frame"); // 포로리(보노보노)
    const $prrImg = $('.game>.frame>ul>li');
    
    const $prrExtLeft = $(".ext-l"); // 왼쪽에서 나오는 포로리
    const $leftImg = $(".ext-l>ul>li");
    
    const $prrExtRight = $(".ext-r"); // 오른쪽에서 나오는 포로리
    const $rightImg = $(".ext-r>ul>li");

    const $comment = $(".game>.comment");
    const $score = $(".game>strong");

    const $ending = $(".game>.ending");
    const $finalScore = $(".game>.ending>.finalScore");

    const arrX = [99, 295, 660, 877]; // 포로리 위치 X값 배열 리스트
    const arrY1 = [320, 558]; // 포로리 위치 X값 99 or 660일 경우 위치 Y값 (coordIdx=0 or 2)
    const arrY2 = [400, 640]; // 포로리 위치 X값 295 or 877일 경우 위치 Y값 (coordIdx=1 or 3)
    const arrExtY = [0, 289, 578]; // 옆쪽에서 나오는 포로리 위치 Y값
    
    const bgm = new Audio("media/bgm.mp3"); // 게임 BGM
    const effectPRR = new Audio("media/wannabeatme_prr.mp3"); // 날 때릴꺼야? 이펙트
    const effectNBR = new Audio("media/beatyou.mp3"); // 때릴 때 너부리 이펙트
    const ed = new Audio("media/sweating.mp3"); // 끝났을 때 효과음
    bgm.volume = 0.7;
    effectPRR.volume = 0.3;
    effectNBR.volume = 0.5;

    let score = 0; // 점수
    let intervalID = null; // 게임 타이머
    
    let prrIdx = null; // 포로리(보노보노) 종류 index (랜덤추출, 0~1: 포로리, 2: 보노보노)
    let coordIdx = null; // arrX의 index (랜덤추출)
    let extIdx = null; // index 랜덤추출값 0~7 중 6, 7 나올 시 포로리가 옆쪽에서 나옴
    // 확률 조정하고 싶으면 랜덤추출값 범위를 조절해 주세요

    nowIdx = 0;

    const prrShowHide = function(){
        // 다시 시작하는 경우 CSS 초기화 및 Game Over 팝업 닫음
        $ending.removeAttr("style").hide();
        $finalScore.removeAttr("style").hide();

        clearInterval(intervalID);

        intervalID = setInterval(function(){
            $comment.text("나 때리꺼야?! 때리꺼야?!!");

            extIdx = Math.floor(Math.random()*8); // 랜덤index (0~7)

            // extIdx 0~5 : 화면 내, 6 : 화면 왼쪽, 7 : 화면 오른쪽
            if(extIdx>=0 && extIdx<6){

                prrIdx = Math.floor(Math.random()*3); // 포로리(보노보노) 종류 index 0~2
                coordIdx = Math.floor(Math.random()*4); // 포로리 위치 index 0~3
    
                let prrSrc = null;
                if(prrIdx==2){
                    prrSrc = "./images/bonobono.png";
                }else{
                    prrSrc = "./images/porori0" + (prrIdx+1) + ".png"
                }
    
                $prr.find("ul>li").eq(prrIdx).show().siblings().hide();
                $prr.find("ul>li>img").eq(prrIdx).attr({
                    src:prrSrc
                });
    
                let coordX = arrX[coordIdx]; // 99, 295, 660, 877
                let coordY = 0;
    
                if(coordIdx==0 || coordIdx==2){
                    coordY = arrY1[Math.floor(Math.random()*2)]; // X값이 99 or 660일 때 Y: 320, 558
                }else{
                    coordY = arrY2[Math.floor(Math.random()*2)]; // X값이 295 or 877일 때 Y: 400, 640
                }
                
                $prr.css({
                    display:"block",
                    left:coordX,
                    top:coordY
                }).stop().animate({top:coordY-25},450).delay(200).animate({top:coordY},150);
    
                $prrImg.css({
                    cursor:"auto"
                });
                
            }else if(extIdx==6){

                $prr.find("ul>li").hide();

                prrIdx = Math.floor(Math.random()*2); // 포로리 종류 index 0, 1
                coordIdx = Math.floor(Math.random()*3); // 포로리 위치 index 0~2

                let prrSrc = "./images/porori_ext_0" + (prrIdx+1) + "_l.png";

                $prrExtLeft.find("ul>li").eq(prrIdx).show().siblings().hide();
                $prrExtLeft.find("ul>li>img").eq(prrIdx).attr({
                    src:prrSrc
                });
                
                let coordY = arrExtY[Math.floor(Math.random()*3)]; // Y: 0, 289, 578
                
                $prrExtLeft.css({
                    display:"block",
                    top:coordY
                }).stop().animate({left:-50},450).delay(200).animate({left:-200},150);

                $leftImg.css({
                    cursor:"auto"
                });

            }else if(extIdx==7){
                
                $prr.find("ul>li").hide();

                prrIdx = Math.floor(Math.random()*2); // 포로리 종류 index 0, 1
                coordIdx = Math.floor(Math.random()*3); // 포로리 위치 index 0~2

                let prrSrc = "./images/porori_ext_0" + (prrIdx+1) + "_r.png";

                $prrExtRight.find("ul>li").eq(prrIdx).show().siblings().hide();
                $prrExtRight.find("ul>li>img").eq(prrIdx).attr({
                    src:prrSrc
                });

                let coordY = arrExtY[Math.floor(Math.random()*3)]; // Y: 0, 289, 578

                $prrExtRight.css({
                    display:"block",
                    top:coordY
                }).stop().animate({right:-50},450).delay(200).animate({right:-200},150);

                $rightImg.css({
                    cursor:"auto"
                });

            }
            
            effectPRR.play();

        },800);
    };

    $btnStart.on("click",function(){
        score = 0; // 점수 초기화
        $score.text("0000점");
        $btnStart.hide();

        // 게임 시작 시 BGM 재생
        bgm.play();
        
        // 포로리 출현 시작
        prrShowHide();
        
        // setTimeout(콜백함수, 지정시간) - 지정된 시간후에 콜백함수를 딱 한번만 호출하고 끝남!
        setTimeout(function(){
            $prr.hide();

            clearInterval(intervalID);
            
            $btnStart.show();
            
            bgm.pause();
            bgm.currentTime = 0;
        },15000); // 플레이 시간 15초
        
        setTimeout(function(){
            $comment.text("버튼을 누르면 게임이 시작됩니다.");

            // 최종 스코어 반영
            $finalScore.text(score+"점");

            // Game Over 팝업 띄움
            $ending.show().animate({
                bottom:15,
                width:721,
                height:651,
                "margin-left":-360
            },300).animate({
                bottom:20,
                width:701,
                height:633,
                "margin-left":-350
            },200).animate({
                bottom:15,
                width:721,
                height:651,
                "margin-left":-360
            },200);

            // 최종 스코어 표시
            $finalScore.delay(400).animate({height:78});

            ed.play();
        },15100);
    });
    
    $prrImg.on({
        "click":function(){
            nowIdx=$prrImg.index(this);

            if(nowIdx==0 || nowIdx==1){
                score += 100;

                $(this).find("img").attr({
                    src:"images/porori03.png"
                });

                $comment.text("끄아아아아");
            }else{
                score -= 100;
                
                $(this).find("img").attr({
                    src:"images/bonobono02.png"
                });
                
                $comment.text("나 때리지마아아ㅠㅠㅠ 으아앙");
            }
            
            $score.text(score+"점");
            
            $(this).css({
                cursor:"url(./images/neoburi02.png),auto"
            });

            // 너부리 "때릴거다!" 이펙트
            effectNBR.load();
            effectNBR.play();
        },
        "mouseover":function(){
            $(this).css({
                cursor:"crosshair"
            });
        }
    });
    
    // 옆쪽에서 나오는 포로리 누를 때 효과
    $leftImg.on({
        "click":function(){

            score += 200;
            
            $(this).find("img").attr({
                src:"images/porori_ext_03_l.png"
            });
            
            $comment.text("여기까지 언제 올라왔어ㅠㅠ 끄아아");
            
            $score.text(score+"점");
            
            $(this).css({
                cursor:"url(./images/neoburi02.png),auto"
            });

            // 너부리 "때릴거다!" 이펙트
            effectNBR.load();
            effectNBR.play();
        },
        "mouseover":function(){
            $(this).css({
                cursor:"crosshair"
            });
        }
    });

    $rightImg.on({
        "click":function(){

            score += 200;

            $(this).find("img").attr({
                src:"images/porori_ext_03_r.png"
            });
            
            $comment.text("여기까지 언제 올라왔어ㅠㅠ 끄아아");
            
            $score.text(score+"점");

            $(this).css({
                cursor:"url(./images/neoburi02.png),auto"
            });
            
            // 너부리 "때릴거다!" 이펙트
            effectNBR.load();
            effectNBR.play();
        },
        "mouseover":function(){
            $(this).css({
                cursor:"crosshair"
            });
        }
    });
});
