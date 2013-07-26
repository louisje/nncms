(function(cms) {

	cms.youtubeUtility = cms.youtubeUtility || {

		checkVideoValidity: function (youtube) {

			var checkResult = {
                // Private video?
                isPrivateVideo: false,
                // Not playable in some regions?
                isZoneLimited: false,
                // Not playable on mobile device?
                isSyndicateLimited: false,
                // Non-embeddable video?
                isEmbedLimited: false,
                isUnplayableVideo: false
			};

            var ytData, hasSyndicateDenied, hasLimitedSyndication;

            if (youtube.data) {
                ytData = youtube.data;
                checkResult.isPrivateVideo = false;
                checkResult.isZoneLimited = (ytData.restrictions) ? true : false;
                hasSyndicateDenied = (ytData.accessControl && ytData.accessControl.syndicate && 'denied' === ytData.accessControl.syndicate) ? true : false;
                hasLimitedSyndication = (ytData.status && ytData.status.reason && 'limitedSyndication' === ytData.status.reason) ? true : false;
                checkResult.isSyndicateLimited = (hasSyndicateDenied || hasLimitedSyndication) ? true : false;
                checkResult.isEmbedLimited = (ytData.accessControl && ytData.accessControl.embed && 'denied' === ytData.accessControl.embed) ? true : false;
                checkResult.isUnplayableVideo = (checkResult.isEmbedLimited || hasSyndicateDenied || (ytData.status && !hasLimitedSyndication)) ? true : false;
            } else {
                checkResult.isPrivateVideo = (youtube.error && youtube.error.code && 403 === youtube.error.code) ? true : false;
            }

			return checkResult;
		}

	};

})(cms);