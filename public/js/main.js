(function (Module, $) {
    'use strict';

    const COLS = 30;
    const ROWS = 30;
    const GAP_SIZE = 1;
    const CELL_SIZE = 10;
    const CANVAS_WIDTH = COLS * (CELL_SIZE + GAP_SIZE);
    const CANVAS_HEIGHT = ROWS * (CELL_SIZE + GAP_SIZE);

    var isDrawing,
        canvas,
        context;

    function createCanvasElement(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        return canvas;
    }

    function draw(event) {
        if (!isDrawing) {
            return;
        }

        const x = event.pageX - canvas.offsetLeft,
              y = event.pageY - canvas.offsetTop;
        context.lineTo(x, y);
        context.moveTo(x, y);
        context.stroke();
    }

    function startDrawing(event) {
        isDrawing = true;

        context.beginPath();
        context.moveTo(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function initCanvas(container)
    {
        canvas = createCanvasElement(CANVAS_WIDTH, CANVAS_HEIGHT);
        context = canvas.getContext("2d");

        canvas.onmousedown = startDrawing;
        canvas.onmouseup = canvas.onmouseout = stopDrawing;
        canvas.onmousemove = draw;

        $(container).append(canvas);
        isDrawing = false;
    }

    function resetCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function popupOpen() {
        $(popup).fadeIn();
        $('body').addClass('popup-opened');
    }

    function popupClose() {
        $(popup).fadeOut();
        $('body').removeClass('popup-opened');
    }

    function initCanvasButtons(container) {
        container.append(
            $('<div>', {class: 'canvas-buttons'})
                .append(
                    $('<button>', {type: 'button', text: 'Сохранить'}).on('click', popupOpen)
                )
                .append(
                    $('<button>', {type: 'button', text: 'Очистить'}).on('click', resetCanvas)
                )
        );
    }

    function initPopup() {
        const popup = $('#popup'),
              popupCloseBtn = popup.find('#popup-close'),
              saveSectionBtn = popup.find('.save-form__btn-wrapper .action-btn'),
              saveForm = popup.find('#save-form');

        $(saveForm).validate({
            errorClass: 'error',
            rules: {
                'login': {
                    required: true
                },
                'password': {
                    required: true
                }
            },
            messages: {
                'login': {
                    required: 'Пожалуйста, введите логин'
                },
                'password': {
                    required: 'Пожалуйста, введите пароль'
                }
            },
            ignore: []
        });

        popup.on('click', function(event) {
            if ($(event.target).hasClass('popup')) {
                popupClose();
            }
        });
        popupCloseBtn.on('click', popupClose);

        saveSectionBtn.on('click', function () {
            if (!saveForm.valid()) {
                return;
            }

            const formDataArray = saveForm.serializeArray();
            var data = {};

            $(formDataArray).each(function (i, elem) {
                data[elem.name] = elem.value;
            });
            data.image = canvas.toDataURL('image/png');

            $.ajax({
                url: saveForm.data('action'),
                type: 'post',
                data: data,
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'json',
                success: function(response) {
                    if (response.status === 'success') {
                        saveForm.get(0).reset();
                        resetCanvas();
                        popupClose();
                    } else {
                        const errorMessage = saveForm.find('div.error');
                        errorMessage.text(response.message).fadeIn();
                        setTimeout(function() {
                            errorMessage.fadeOut().text('');
                        }, 2000);
                    }
                }
            });
        });
    }

    $.extend(Module, {
        init: function (container) {
            initCanvas(container);
            initCanvasButtons(container);
            initPopup();
        }
    });
})(Canvas = window.Canvas || {}, $);
