import Handlebars from './handlebars.js'
import '!file?name=data/[name].[ext]!../data/comments.json'
import moment from 'moment'
    // top-skills
    (($, undefined) => {
        // Initiate
        window.preloader = new $.materialPreloader({
            position: 'top',
            height: '5px',
            fadeIn: 200,
            fadeOut: 200
        });
        window.preloader.on();

        var modal = $('#myModal').modal({
            keyboard: false,
            show: false
        });

        $('.btn, .dropdown-menu a, .navbar a, .navbar-panel a, .toolbar a, .nav-pills a, .nav-tabs a, .pager a, .pagination a, .list-group a').mtrRipple({
            live: true
        }).on('click', function(e) {
            e.preventDefault();
        });

        var templateTopic = Handlebars.compile(require('../views/topic.html')),
            templateResponse = Handlebars.compile(require('../views/response.html')),
            templateForm = Handlebars.compile(require('../views/form.html')),
            promise = $.get('./data/comments.json', () => {}, 'json');

        promise.done((comments) => {
            appendTopics(comments.topics);
            updateTimes();
            bindReplyEvents();
            window.preloader.off();
        });

        function appendTopics(topics) {
            var len = topics.length,
                i = 0;
            for (; i < len; i++) {
                let topic = topics[i],
                    j = 0,
                    responsesLen = topic.responses.length,
                    isTopicOdd = i % 2;
                let $topic = $(templateTopic({
                    title: topic.topictitle,
                    id: i,
                    evenOrOdd: isTopicOdd ? 'odd' : 'even',
                    nbrComments: topic.responses.length
                }));
                for (; j < responsesLen; j++) {
                    let response = topics[i].responses[j],
                        $response = getResponseElement(response);
                    if (response.parentid === 0) {
                        $response.addClass(isTopicOdd ? 'row-odd' : 'row-even');
                        $topic.find('> .responses').append($response);
                    } else {
                        let $parent = $topic.find(`#response-${response.parentid}`),
                            $responses = $topic.find(`#response-${response.parentid}`).find('> .media-body > .responses');
                        // If we already have response ath the same level
                        applyOddOrEvenClass($parent, $responses, $response);
                        $responses.append($response);
                    }
                }
                $('#comments-wrapper').append($topic);
            }
        }

        function applyOddOrEvenClass($parent, $responses, $response) {
            if ($responses.children().length) {
                let $lastElement = $responses.children().last();
                $response.addClass(!$lastElement.hasClass('row-odd') ? 'row-odd' : 'row-even');
            } else {
                $response.addClass(!$parent.hasClass('row-odd') ? 'row-odd' : 'row-even');
            }
        }

        function getResponseElement(response) {
            // Bind the response data for further usage (e.g: reply)
            return $(templateResponse(response)).data('response', response);
        }

        function updateTimes() {
            var $responses = $('#comments-wrapper').find('.response'),
                len = $responses.length,
                i = 0;
            for (; i < len; i++) {
                let $response = $($responses[i]),
                    data = $response.data('response'),
                    ago = moment().subtract(data.age, 'seconds').fromNow(),
                    time = moment().subtract(data.age, 'seconds').format("MMM Do YY");
                $response.find('.time').text(time);
                $response.find('.time-relative').text(ago);
            }
        }

        function bindReplyEvents() {
            var $reply = $('#comments-wrapper').find('button.btn-reply');
            $('#comments-wrapper').on('click', 'button.btn-reply', (e) => {
                e.preventDefault();
                let $el = $(e.currentTarget),
                    $parent = $el.closest('.response'),
                    response = $parent.data('response');
                modal.find('.modal-content').html(templateForm(response));
                modal.find('form').off('submit').on('submit', (e) => {
                    e.preventDefault();
                    let formData = $(e.currentTarget).serializeArray()[0],
                        $responses = $parent.find('> .media-body > .responses').first(),
                        $response = getResponseElement({
                            posttext: formData.value,
                            author: 'Yourself',
                            age: 0,
                            parentid: response.id
                        });
                    applyOddOrEvenClass($parent, $responses, $response)
                    $responses.append($response);
                    $.smoothScroll({
                        scrollTarget: $response
                    });
                    updateTimes();
                    modal.modal('hide');
                });
                modal.modal('show');
                modal.on('shown.bs.modal', function(e) {
                    modal.find('form textarea').focus();
                })

            });
        }

    })(jQuery);
