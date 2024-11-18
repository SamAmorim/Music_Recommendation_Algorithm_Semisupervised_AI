const reportTypeForm = document.getElementById('report-type-form');
const recentlyPlayedContainer = document.getElementById('recently-played-container');
const recentlyPlayedSpinner = document.getElementById('recently-played-spinner');
const aiRecommendationContainer = document.getElementById('ai-recommendation-container');
const aiRecommendationSpinner = document.getElementById('ai-recommendation-spinner');
const trackComponent = document.getElementById('track-component');
const audioPlayer = document.getElementById('audio-player');
const artistsList = document.getElementById('artists-list');
const artistComponent = document.getElementById('artist-component');
const artistsSpinner = document.getElementById('artists-spinner');

const metricsTracks = document.getElementById('metric-tracks');
const metricsTracksSpinner = document.getElementById('metric-tracks-spinner');
const metricsAlbums = document.getElementById('metric-albums');
const metricsAlbumsSpinner = document.getElementById('metric-albums-spinner');
const metricsArtists = document.getElementById('metric-artists');
const metricsArtistsSpinner = document.getElementById('metric-artists-spinner');
const metricsGenres = document.getElementById('metric-genres');
const metricsGenresSpinner = document.getElementById('metric-genres-spinner');


const characteristicsSpinner = document.getElementById('characteristics-spinner');
const characteristicsChart = document.getElementById('characteristics-chart');
const musicalitySpinner = document.getElementById('musicality-spinner');
const musicalityChart = document.getElementById('musicality-chart');
const genresSpinner = document.getElementById('genres-spinner');
const genresChart = document.getElementById('genres-chart');

Chart.register(ChartDataLabels);

const featureNames = {
    acousticness: 'Acústica',
    danceability: 'Dançante',
    energy: 'Energética',
    valence: 'Positiva',
    liveness: 'Ao Vivo',
    instrumentalness: 'Instrumental',
    speechiness: 'Falada'
};

var aiRecommendationFetched = false;

async function getReports() {
    recentlyPlayedSpinner.style.display = 'block';
    artistsSpinner.style.display = 'block';
    
    metricsAlbumsSpinner.style.display = 'block';
    metricsTracksSpinner.style.display = 'block';
    metricsArtistsSpinner.style.display = 'block';
    metricsGenresSpinner.style.display = 'block';

    characteristicsSpinner.style.display = 'block';
    musicalitySpinner.style.display = 'block';
    genresSpinner.style.display = 'block';

    async function getRecentlyPlayed() {
        await fetch('/spotify/recently-played')
            .then(response => response.json())
            .then(
                data => {
                    if (data.error) {
                        console.error(data);
                        recentlyPlayedContainer.innerHTML = `<p class="text-center text-white">Erro ao carregar músicas recentes</p><p class="text-center text-white">${JSON.stringify(data.error)}</p>`;
                        return;
                    }

                    data.items.forEach(item => {
                        const newTrackComponent = trackComponent.cloneNode(true);
                        newTrackComponent.style.display = 'block';
                        newTrackComponent.querySelector('#track-image').src = item.track.album.images[2].url;
                        newTrackComponent.querySelector('#track-image').alt = item.track.name;
                        newTrackComponent.querySelector('#track-name').textContent = item.track.name;
                        newTrackComponent.querySelector('#track-artist').textContent = item.track.artists[0].name;
                        recentlyPlayedContainer.appendChild(newTrackComponent);
                    });
                },
                error => {
                    console.error(error);
                    recentlyPlayedContainer.innerHTML = `<p class="text-center text-white">Erro ao carregar músicas recentes</p><p class="text-center text-white">${JSON.stringify(error)}</p>`;
                }
            );

        recentlyPlayedSpinner.style.display = 'none';
    };

    async function getMostListenedArtists() {
        fetch('/report/most-listened-artists')
            .then(response => response.json())
            .then(
                data => {
                    if (data.error) {
                        console.error(data);
                        return;
                    }

                    data.forEach((artist, index) => {
                        const newArtistComponent = artistComponent.cloneNode(true);
                        newArtistComponent.style.display = 'flex';

                        if (index === 0)
                            newArtistComponent.classList.add('bg-primary');

                        newArtistComponent.querySelector('#artist-image').src = artist[1]['image_url'];
                        newArtistComponent.querySelector('#artist-image').alt = artist[0];
                        newArtistComponent.querySelector('#artist-name').textContent = artist[0];

                        if (index === 0)
                            newArtistComponent.querySelector('#artist-name').classList.add('fw-bolder');

                        newArtistComponent.querySelector('#artist-plays').textContent = artist[1].count;

                        if (index === 0)
                            newArtistComponent.querySelector('#artist-plays').classList.add('fw-bolder');

                        artistsList.appendChild(newArtistComponent);
                    });
                }
            )

        artistsSpinner.style.display = 'none';
    };

    async function getMetrics() {
        await fetch('/report/metrics')
            .then(response => response.json())
            .then(
                data => {
                    if (data.error) {
                        console.error(data);
                        return;
                    }

                    console.log(data);

                    metricsAlbums.textContent = data.albums;
                    metricsArtists.textContent = data.artists;
                    metricsGenres.textContent = data.genres;
                    metricsTracks.textContent = data.tracks;
                }
            )

        metricsAlbumsSpinner.style.display = 'none';
        metricsTracksSpinner.style.display = 'none';
        metricsArtistsSpinner.style.display = 'none';
        metricsGenresSpinner.style.display = 'none';
    };

    async function createCharts() {
        async function createCharacteristicsChart() {
            var mostPresentFeatures = await fetch('/report/most-present-features')
                .then(response => response.json())
                .then(
                    data => {
                        if (data.error) {
                            console.error(data);
                            return;
                        }
    
                        return data;
                    }
                );
    
            new Chart(
                characteristicsChart,
                {
                    type: 'bar',
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                ticks: {
                                    color: "#fff"
                                },
                                grid: {
                                    display: false
                                }
                            },
                            y: {
                                ticks: {
                                    color: "#fff",
                                    callback: value => value + "%"
                                },
                                grid: {
                                    color: "rgba(255, 255, 255, 0.25)"
                                },
                                max: 100
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: false
                            },
                            datalabels: {
                                display: false
                            }
                        }
                    },
                    data: {
                        labels: Object.keys(mostPresentFeatures).map(feature => getStringCapitalizedWords(featureNames[feature])),
                        datasets: [
                            {
                                label: 'Média',
                                data: Object.values(mostPresentFeatures).map(value => value * 100),
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                    'rgba(181, 255, 8, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)',
                                    'rgba(181, 255, 8, 1)'
                                ],
                                borderWidth: 1
                            }
                        ]
                    }
                }
            );
    
            characteristicsSpinner.style.display = 'none';
        }
    
        async function createGenresChart() {
            mostListenedGenres = await fetch('/report/most-listened-genres')
                .then(response => response.json())
                .then(
                    data => {
                        if (data.error) {
                            console.error(data);
                            return;
                        }
    
                        return data;
                    }
                );
    
            new Chart(
                genresChart,
                {
                    type: 'radar',
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: {
                                ticks: {
                                    color: "rgba(255, 255, 255, 0.5)",
                                    backdropColor: "rgba(0, 0, 0, 0)"
                                },
                                grid: {
                                    color: "rgba(255, 255, 255, 0.25)"
                                },
                                pointLabels: {
                                    color: "#fff"
                                }
                            },
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: false
                            },
                            datalabels: {
                                display: false
                            }
                        }
                    },
                    data: {
                        labels: mostListenedGenres.map(genre => getStringCapitalizedWords(genre[0])),
                        datasets: [
                            {
                                label: 'Músicas',
                                data: mostListenedGenres.map(genre => genre[1]),
                                backgroundColor: 'rgba(153, 102, 255, 0.25)',
                                borderColor: 'rgba(153, 102, 255, 1)',
                                borderWidth: 1,
                                pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                            }
                        ]
                    },
                }
            )
    
            genresSpinner.style.display = 'none';
        }
    
        async function createMusicalityChart() {
            var musicalityByDates = await fetch('/report/features-by-dates')
                .then(response => response.json())
                .then(
                    data => {
                        if (data.error) {
                            console.error(data);
                            return;
                        }
    
                        return data;
                    }
                );
    
            new Chart(
                musicalityChart,
                {
                    type: 'line',
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                type: 'time',
                                ticks: {
                                    color: "#fff"
                                },
                                grid: {
                                    display: false
                                }
                            },
                            y: {
                                ticks: {
                                    color: "#fff",
                                    callback: value => value + "%"
                                },
                                grid: {
                                    color: "rgba(255, 255, 255, 0.25)"
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: true,
                                position: 'bottom',
                                labels: {
                                    color: '#fff',
                                    font: {
                                        size: 12
                                    }
                                }
                            },
                            title: {
                                display: false
                            },
                            datalabels: {
                                display: false
                            }
                        }
                    },
                    data: {
                        labels: Object.keys(musicalityByDates).map(date => musicalityByDates[date]),
                        datasets: Object.keys(featureNames).map(feature => (
                            {
                                label: featureNames[feature],
                                data: Object.keys(musicalityByDates).map(date => (
                                    {
                                        x: date,
                                        y: musicalityByDates[date]
                                    }
                                ))
                            }
                        )),
                        fill: false,
                        borderWidth: 1
                    }
                }
            );
    
            musicalitySpinner.style.display = 'none';
        }
    
        await createGenresChart();

        await new Promise(resolve => setTimeout(resolve, 5000));

        await createCharacteristicsChart();
        // await createMusicalityChart();
    };
    
    await getRecentlyPlayed();
    await getMetrics();
    await getMostListenedArtists();

    await createCharts();
};

getReports();

async function getAiRecommendation() {
    aiRecommendationSpinner.style.display = 'block';

    await fetch('/prediction')
        .then(response => response.json())
        .then(
            data => {
                if (data.error) {
                    console.error(data);
                    aiRecommendationContainer.innerHTML = `<p class="text-center text-white">Erro ao carregar recomendação</p><p class="text-center text-white">${JSON.stringify(data.error)}</p>`;
                    return;
                }

                data.forEach(item => {
                    const newTrackComponent = trackComponent.cloneNode(true);
                    newTrackComponent.style.display = 'block';
                    newTrackComponent.querySelector('#prediction-precision').textContent = item.similarity.toFixed(0) + "%";
                    newTrackComponent.querySelector('#track-image').src = item['track_data'].album.images[2].url;
                    newTrackComponent.querySelector('#track-image').alt = item['track_data'].name;
                    newTrackComponent.querySelector('#track-name').textContent = item['track_data'].name;
                    newTrackComponent.querySelector('#track-artist').textContent = item['track_data'].artists[0].name;

                    if (item['track_data'].preview_url) {

                        newTrackComponent.querySelector('#track-footer').style.display = 'block';

                        const progressBar = newTrackComponent.querySelector('#audio-progress');

                        audioPlayer.addEventListener('timeupdate', () => {
                            if (audioPlayer.src === item['track_data'].preview_url) {
                                progressBar.style.width = audioPlayer.currentTime / audioPlayer.duration * 100 + '%';
                            }
                            else {
                                progressBar.style.width = '0%';
                            }
                        });

                        newTrackComponent.querySelector('#audio-play').addEventListener('click', () => {
                            if (audioPlayer.src === item['track_data'].preview_url) {
                                if (audioPlayer.paused) {
                                    audioPlayer.play();
                                    newTrackComponent.querySelector('#audio-play').textContent = '⏸';
                                } else {
                                    audioPlayer.pause();
                                    newTrackComponent.querySelector('#audio-play').textContent = '▶';
                                }
                            } else {
                                audioPlayer.src = item['track_data'].preview_url;
                                audioPlayer.play();
                                newTrackComponent.querySelector('#audio-play').textContent = '⏸';
                            }
                        });
                    }

                    aiRecommendationContainer.appendChild(newTrackComponent);
                });
            },
            error => {
                console.error(error);
                aiRecommendationContainer.innerHTML = `<p class="text-center text-white">Erro ao carregar recomendação</p><p class="text-center text-white">${JSON.stringify(error)}</p>`;
            }
        );

    aiRecommendationSpinner.style.display = 'none';
};

reportTypeForm.addEventListener('change', e => {
    if (e.target.id === 'recently-played') {
        recentlyPlayedContainer.style.display = 'flex';
        aiRecommendationContainer.style.display = 'none';
    } else {
        recentlyPlayedContainer.style.display = 'none';
        aiRecommendationContainer.style.display = 'flex';

        if (aiRecommendationFetched === false) {
            aiRecommendationFetched = true;
            getAiRecommendation();
        }
    }
});
