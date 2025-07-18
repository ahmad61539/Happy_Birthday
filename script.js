        let gameScore = 0;
        let gameTimer = 30;
        let gameActive = false;
        let gameInterval;
        let balloonsRemaining = 12;
        
        let musicPlaying = false;
        let currentSongIndex = 0;
        const songs = [
            "🎵 Happy Birthday Song 🎵",
            "🎶 Sweet Seventeen Song 🎶",
            "🎵 Birthday Wishes Song 🎵",
            "🎶 Celebration Song 🎶"
        ];

        let audioContext;
        let oscillator;
        let gainNode;

        function initAudioContext() {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }

        function createBirthdayMelody() {
            if (!audioContext) return;

            if (oscillator) {
                oscillator.stop();
            }

            oscillator = audioContext.createOscillator();
            gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            const melody = [261.63, 261.63, 293.66, 261.63, 349.23, 329.63]; // C C D C F E
            let noteIndex = 0;
            
            function playNextNote() {
                if (musicPlaying && noteIndex < melody.length) {
                    oscillator.frequency.setValueAtTime(melody[noteIndex], audioContext.currentTime);
                    noteIndex++;
                    setTimeout(playNextNote, 500);
                } else if (musicPlaying) {
                    noteIndex = 0;
                    setTimeout(playNextNote, 1000);
                }
            }
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(melody[0], audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            oscillator.start();
            
            playNextNote();
        }

        function createFloatingEmojis() {
            const container = document.getElementById('floatingEmojis');
            const emojis = ['🎂', '🎈', '🎁', '🎉', '🎊', '🌟', '💝', '🎵', '🎶', '💖'];
            
            setInterval(() => {
                const emoji = document.createElement('div');
                emoji.className = 'emoji';
                emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                emoji.style.left = Math.random() * 100 + '%';
                emoji.style.animationDuration = (Math.random() * 3 + 4) + 's';
                container.appendChild(emoji);
                
                setTimeout(() => {
                    emoji.remove();
                }, 7000);
            }, 800);
        }

        function showPhotoMessage(photoNum) {
            const messages = [
                "📷 Foto kenangan indah bersama teman-teman!",
                "🎂 Moment meniup lilin birthday cake!",
                "🎈 Dekorasi balon warna-warni yang cantik!",
                "🎁 Hadiah spesial untuk hari istimewa!",
                "💝 Surprise dari orang-orang terkasih!",
                "🌟 Smile yang paling bersinar di hari spesial!"
            ];
            
            alert(messages[photoNum - 1]);
        }

        function toggleMusic() {
    const btn = document.getElementById('playBtn');
    const audio = document.getElementById('backgroundMusic');

    if (musicPlaying) {
        audio.pause();
        btn.textContent = '▶️';
        btn.classList.remove('playing');
        musicPlaying = false;
    } else {
        audio.play();
        btn.textContent = '⏸️';
        btn.classList.add('playing');
        musicPlaying = true;
    }
}


        function nextSong() {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
            document.getElementById('currentSong').textContent = songs[currentSongIndex];
            if (musicPlaying) {
                createBirthdayMelody();
            }
        }

        function prevSong() {
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            document.getElementById('currentSong').textContent = songs[currentSongIndex];
            if (musicPlaying) {
                createBirthdayMelody();
            }
        }

        function changeVolume() {
    const volume = document.getElementById('volumeSlider').value / 100;
    const audio = document.getElementById('backgroundMusic');
    audio.volume = volume;
}

        function createBalloons() {
            const gameArea = document.getElementById('balloonsGame');
            gameArea.innerHTML = '';
            
            const colors = ['#ff6b9d', '#c44569', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
            
            for (let i = 0; i < 12; i++) {
                const balloon = document.createElement('button');
                balloon.className = 'balloon-btn';
                balloon.style.background = `radial-gradient(circle at 30% 30%, ${colors[Math.floor(Math.random() * colors.length)]}, #333)`;
                balloon.textContent = '🎈';
                balloon.onclick = () => popBalloon(balloon);
                balloon.disabled = !gameActive;
                gameArea.appendChild(balloon);
            }
            
            balloonsRemaining = 12;
            document.getElementById('balloonCount').textContent = balloonsRemaining;
        }

        function popBalloon(balloon) {
            if (!gameActive || balloon.classList.contains('popped')) return;
            
            balloon.classList.add('popped');
            balloon.textContent = '💥';
            balloon.disabled = true;
            
            gameScore += 10;
            balloonsRemaining--;
            
            document.getElementById('score').textContent = gameScore;
            document.getElementById('balloonCount').textContent = balloonsRemaining;

            if (gameScore === 50) {
                alert('🎉 Wow! Kamu hebat! Bonus 50 poin!');
                gameScore += 50;
                document.getElementById('score').textContent = gameScore;
            } else if (gameScore === 120) {
                alert('🌟 Amazing! Kamu mendapat hadiah spesial!');
            }

            if (balloonsRemaining === 0) {
                endGame();
            }
        }

        function startGame() {
            gameActive = true;
            gameScore = 0;
            gameTimer = 30;
            
            document.getElementById('score').textContent = gameScore;
            document.getElementById('timer').textContent = gameTimer;
            document.getElementById('gameOver').style.display = 'none';
            document.getElementById('startBtn').disabled = true;
            
            createBalloons();
            
            gameInterval = setInterval(() => {
                gameTimer--;
                document.getElementById('timer').textContent = gameTimer;
                
                if (gameTimer <= 0) {
                    endGame();
                }
            }, 1000);
        }

        function endGame() {
            gameActive = false;
            clearInterval(gameInterval);

            const balloons = document.querySelectorAll('.balloon-btn');
            balloons.forEach(balloon => balloon.disabled = true);
            
            document.getElementById('startBtn').disabled = false;

            const gameOverDiv = document.getElementById('gameOver');
            const finalScoreSpan = document.getElementById('finalScore');
            const gameResultSpan = document.getElementById('gameResult');
            
            finalScoreSpan.textContent = `Skor Akhir: ${gameScore} poin`;
            
            let result = '';
            if (gameScore >= 200) {
                result = '🏆 Luar biasa! Kamu adalah master balon!';
            } else if (gameScore >= 150) {
                result = '🌟 Hebat sekali! Kamu sangat mahir!';
            } else if (gameScore >= 100) {
                result = '🎉 Bagus! Kamu bermain dengan baik!';
            } else if (gameScore >= 50) {
                result = '👍 Tidak buruk! Coba lagi untuk skor yang lebih tinggi!';
            } else {
                result = '💪 Jangan menyerah! Latihan membuat sempurna!';
            }
            
            gameResultSpan.textContent = result;
            gameOverDiv.style.display = 'block';
        }

        function resetGame() {
            gameActive = false;
            clearInterval(gameInterval);
            
            gameScore = 0;
            gameTimer = 30;
            
            document.getElementById('score').textContent = gameScore;
            document.getElementById('timer').textContent = gameTimer;
            document.getElementById('gameOver').style.display = 'none';
            document.getElementById('startBtn').disabled = false;
            
            createBalloons();
        }

        document.addEventListener('DOMContentLoaded', function() {
            createFloatingEmojis();
            createBalloons();
        });