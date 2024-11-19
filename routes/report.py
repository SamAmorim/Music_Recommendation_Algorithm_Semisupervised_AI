from flask import Blueprint, render_template, session, redirect
from services.report import get_most_listened_artists, get_most_listened_genres, get_most_present_features, get_metrics, get_features_in_saved_tracks
from services.spotify import get_recently_played, get_artist_info

report_bp = Blueprint('report', __name__, url_prefix='/report')

@report_bp.route('/', methods=['GET'])
def main():
    if 'user' not in session:
        return redirect('/')
    return render_template('report.html')

@report_bp.route('/data', methods=['GET'])
def data():
    recently_played = get_recently_played()

    most_listened_artists = get_most_listened_artists(recent_tracks=recently_played)
    most_present_features = get_most_present_features(recent_tracks=recently_played)
    
    for track in recently_played['items']:
        for artist in track['track']['artists']:
            artist_id = artist['id']
            artist['info'] = get_artist_info(artist_id)

    most_listened_genres = get_most_listened_genres(recent_tracks=recently_played)
    metrics = get_metrics(recent_tracks=recently_played)
    
    return {
        'most_listened_artists': most_listened_artists,
        'most_listened_genres': most_listened_genres,
        'most_present_features': most_present_features,
        'metrics': metrics,
    }

# @report_bp.route('/most-listened-artists', methods=['GET'])
# def most_listened_artists():
#     return get_most_listened_artists()

# @report_bp.route('/most-listened-genres', methods=['GET'])
# def most_listened_genres():
#     return get_most_listened_genres()

# @report_bp.route('/most-present-features', methods=['GET'])
# def most_present_features():
#     return get_most_present_features()

# @report_bp.route('/metrics', methods=['GET'])
# def metrics():
#     return get_metrics()

# @report_bp.route('/features-by-dates', methods=['GET'])
# def features_by_dates():
#     return get_features_in_saved_tracks()