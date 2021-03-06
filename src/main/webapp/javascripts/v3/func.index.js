/*jslint browser: true, nomen: true, unparam: true */
/*global $, nn, cms */

(function ($page) {
    'use strict';

    var $common = cms.common;

    $page.showCreateChannelTutorial = function () {
        $('#lightbox-create-channel').remove();
        $('#lightbox-create-channel-tmpl').tmpl().prependTo('body');
        $('.blockOverlay').height($(window).height() - 45);
        $.blockUI.defaults.overlayCSS.opacity = '0.9';
        $.blockUI({
            message: $('#lightbox-create-channel')
        });
    };

    // NOTE: page entry point (keep at the bottom of this file)
    $page.init = function (options) {
        nn.log({
            // NOTE: remember to change page-key to match file-name
            subject: 'CMS.PAGE.INITIALIZED: index',
            options: options
        }, 'debug');

        var pageId = cms.global.PAGE_ID;
        if (cms.global.USER_DATA.id) {
            $common.showProcessingOverlay();
            nn.api('GET', cms.reapi('/api/users/{userId}/channels', {
                userId: cms.global.USER_DATA.id
            }), null, function (channels) {
                var cntChannel = channels.length,
                    hasFavoriteChannel = false,
                    items = [],
                    temp = [];
                $('#title-func').html('');
                $('#title-func-tmpl').tmpl(null, {
                    cntChannel: cntChannel
                }).appendTo('#title-func');
                if (cntChannel > 0) {
                    $.each(channels, function (i, channel) {
                        temp = [];
                        channel.moreImageUrl_1 = cms.config.CHANNEL_DEFAULT_IMAGE;
                        channel.moreImageUrl_2 = cms.config.CHANNEL_DEFAULT_IMAGE2;
                        channel.moreImageUrl_3 = cms.config.CHANNEL_DEFAULT_IMAGE2;
                        if (channel.contentType === cms.config.YOUR_FAVORITE) {
                            hasFavoriteChannel = true;
                            channel.moreImageUrl_1 = 'images/favorite_ch.png';
                            if (channel.moreImageUrl && '' !== $.trim(channel.moreImageUrl)) {
                                temp = channel.moreImageUrl.split('|');
                                if (temp[0] && temp[0] !== cms.config.EPISODE_DEFAULT_IMAGE) {
                                    channel.moreImageUrl_2 = temp[0];
                                }
                            }
                            channel.name = cms.global.USER_DATA.name + nn._([pageId, 'channel-list', "'s Favorite"]);
                        } else {
                            if (channel.imageUrl && '' !== $.trim(channel.imageUrl) && channel.imageUrl !== cms.config.EPISODE_DEFAULT_IMAGE) {
                                channel.moreImageUrl_1 = channel.imageUrl;
                            }
                            if (cms.config.CHANNEL_DEFAULT_IMAGE === channel.moreImageUrl_1) {
                                channel.moreImageUrl_1 = 'images/ch_default.png';
                            }
                            if (channel.moreImageUrl && '' !== $.trim(channel.moreImageUrl)) {
                                temp = channel.moreImageUrl.split('|');
                                if (temp[0] && temp[0] !== cms.config.EPISODE_DEFAULT_IMAGE) {
                                    channel.moreImageUrl_2 = temp[0];
                                }
                            }
                        }
                        items.push(channel);
                    });
                    $('#channel-list').html('');
                    $('#channel-list-tmpl-item').tmpl(items, {
                        userId: cms.global.USER_DATA.id
                    }).appendTo('#channel-list');
                    // channel list sorting
                    $('#channel-list').sortable({
                        cursor: 'move',
                        revert: true,
                        change: function (event, ui) {
                            $('body').addClass('has-change');
                        }
                    });
                    $('#channel-list').sortable('disable');
                } else {
                    $("p.order").hide();
                    $(".curate").hide();
                    $('#content-main-wrap .constrain').empty();
                    $('#channel-list-empty-tmpl').tmpl({
                        id: cms.global.USER_DATA.id
                    }).appendTo('#content-main-wrap .constrain');
                    $('#com-9x9-cycle p.cycle-pager').html('');
                    $('#com-9x9-cycle .wrapper ul.content').cycle({
                        pager: '.cycle-pager',
                        activePagerClass: 'active',
                        updateActivePagerLink: null,
                        fx: 'scrollHorz',
                        speed: 1000,
                        timeout: 6000,
                        pagerEvent: 'mouseover',
                        pause: 1,
                        cleartypeNoBg: true
                    });
                    $('#func-nav ul li.btns').addClass("hide");
                }
                if (cntChannel <= 0 || (1 === cntChannel && hasFavoriteChannel)) {
                    if (!$.cookie('cms-cct')) {
                        $.cookie('cms-cct', 'seen');
                        $page.showCreateChannelTutorial();
                    }
                }

                $('#content-main-wrap').perfectScrollbar("update");
                $('#overlay-s').fadeOut();
            });
        } else {
            location.href = '../';
        }
    };

    // NOTE: remember to change page-key to match file-name
}(cms.namespace('index')));