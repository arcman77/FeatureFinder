<template>
    <div class="coin-container">
        <div class="birkurus">
            <div class="coin">
                <div class="front"></div>
                <div class="back"></div>
                <div class="side">
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                </div>
            </div>
        </div>
        {{coin}}
    </div>
</template>
<script>
    const Coin = {
        props: ['coin'],
        data() {
            return {

            };
        }
    };

    export default Coin;

</script>
<style lang="scss">
.birkurus {
    height: 160px;
    width: 160px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -80px;
    margin-left: -80px;
    -webkit-perspective: 1000;
    -webkit-box-reflect: below 0 linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 45%, rgba(255, 255, 255, 0.2));
    -webkit-filter: saturate(1.45) hue-rotate(2deg);
}
.coin {
    height: 160px;
    width: 160px;
    position: absolute;
    -webkit-transform-style: preserve-3d;
    -webkit-transform-origin: 50%;
    -webkit-animation: spin 2s infinite;
    -webkit-animation-timing-function: linear;
}
.coin .front,
.coin .back {
    position: absolute;
    height: 160px;
    width: 160px;
    border-radius: 50%;
    background-size: cover;
}
.coin .front {
    -webkit-transform: translateZ(8px);
}
.coin .back {
    -webkit-transform: translateZ(-8px) rotateY(180deg);
}
.coin .side {
    -webkit-transform: translateX(72px);
    -webkit-transform-style: preserve-3d;
    -webkit-backface-visibility: hidden;
}
.coin .side .circle {
    height: 160px;
    width: 16px;
    position: absolute;
    -webkit-transform-style: preserve-3d;
    -webkit-backface-visibility: hidden;
}
.coin .side .circle:before,
.coin .side .circle:after {
    content: '';
    display: block;
    height: 15.682742452729697px;
    width: 16px;
    position: absolute;
    -webkit-transform: rotateX(84.375deg);
    background: #d8be83;
    background: linear-gradient(to bottom, #e6cf99 0%, #e6cf99 74%, #c2a970 75%, #c2a970 100%);
    background-size: 100% 3.485053878384377px;
}
.coin .side .circle:before {
    -webkit-transform-origin: top center;
}
.coin .side .circle:after {
    bottom: 0;
    -webkit-transform-origin: center bottom;
}
.coin .side .circle:nth-child(16) {
    -webkit-transform: rotateY(90deg) rotateX(180deg);
}
.coin .side .circle:nth-child(15) {
    -webkit-transform: rotateY(90deg) rotateX(168.75deg);
}
.coin .side .circle:nth-child(14) {
    -webkit-transform: rotateY(90deg) rotateX(157.5deg);
}
.coin .side .circle:nth-child(13) {
    -webkit-transform: rotateY(90deg) rotateX(146.25deg);
}
.coin .side .circle:nth-child(12) {
    -webkit-transform: rotateY(90deg) rotateX(135deg);
}
.coin .side .circle:nth-child(11) {
    -webkit-transform: rotateY(90deg) rotateX(123.75deg);
}
.coin .side .circle:nth-child(10) {
    -webkit-transform: rotateY(90deg) rotateX(112.5deg);
}
.coin .side .circle:nth-child(9) {
    -webkit-transform: rotateY(90deg) rotateX(101.25deg);
}
.coin .side .circle:nth-child(8) {
    -webkit-transform: rotateY(90deg) rotateX(90deg);
}
.coin .side .circle:nth-child(7) {
    -webkit-transform: rotateY(90deg) rotateX(78.75deg);
}
.coin .side .circle:nth-child(6) {
    -webkit-transform: rotateY(90deg) rotateX(67.5deg);
}
.coin .side .circle:nth-child(5) {
    -webkit-transform: rotateY(90deg) rotateX(56.25deg);
}
.coin .side .circle:nth-child(4) {
    -webkit-transform: rotateY(90deg) rotateX(45deg);
}
.coin .side .circle:nth-child(3) {
    -webkit-transform: rotateY(90deg) rotateX(33.75deg);
}
.coin .side .circle:nth-child(2) {
    -webkit-transform: rotateY(90deg) rotateX(22.5deg);
}
.coin .side .circle:nth-child(1) {
    -webkit-transform: rotateY(90deg) rotateX(11.25deg);
}
.coin.skeleton .front,
.coin.skeleton .back {
    display: none;
}
.coin.skeleton .side,
.coin.skeleton .side .circle,
.coin.skeleton .side .circle:before,
.coin.skeleton .side .circle:after {
    -webkit-backface-visibility: visible;
}
.coin.skeleton .side .circle {
    background: rgba(170, 170, 170, 0.09999999999999998);
}
.coin.skeleton .side .circle:before {
    background: rgba(255, 170, 170, 0.19999999999999996);
}
.coin.skeleton .side .circle:after {
    background: rgba(204, 204, 255, 0.19999999999999996);
}
.coin-container {
  background-color: #000;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 10px;
  width: 200px;
  height: 200px;
}
@-webkit-keyframes spin {
    from {
        -webkit-transform: rotateY(0deg);
    }
    to {
        -webkit-transform: rotateY(360deg);
    }
}
.coin .front {
    background: url('../imgs/download2.jpeg');
}
.coin .back {
    background: url('../imgs/download0.jpeg');
}
</style>