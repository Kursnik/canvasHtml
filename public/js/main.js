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
        $(popup).find('#save-form').get(0).reset();
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
            if (!saveForm.valid() || saveSectionBtn.prop('disabled')) {
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
                beforeSend: function() {
                    saveSectionBtn.prop('disabled', true);
                },
                success: function(response) {
                    if (response.status === 'success') {
                        saveForm.get(0).reset();
                        popupClose();
                    } else {
                        const errorMessage = saveForm.find('div.error');
                        errorMessage.text(response.message).fadeIn();
                        setTimeout(function() {
                            errorMessage.fadeOut().text('');
                        }, 2000);
                    }
                },
                complete: function () {
                    saveSectionBtn.prop('disabled', false);
                }
            });
        });
    }

    $.extend(Module, {
        init: function (container) {
            initCanvas(container);
            initCanvasButtons(container);
            initPopup();
        },
        setImage: function (imageHtml, id) {
            resetCanvas();
            context.drawImage(imageHtml, 0, 0);
            $('#popup')
                .find('form.save-form')
                .find('input#id')
                .val(id);
        }
    });
})(Canvas = window.Canvas || {}, $);

(function(Module, Canvas, $) {
    var canvasContainer,
        galleryContainer;

    function initEditButtons() {
        galleryContainer.find('a.edit').on('click', function (event) {
            event.preventDefault();

            const $self = $(this);
            Canvas.setImage($self.siblings('img').get(0), $self.data('id'));

            galleryContainer.fadeOut(function () {
                canvasContainer.fadeIn();
            });
        });
    }

    $.extend(Module, {
        init: function () {
            canvasContainer = $('section.image-edit');
            galleryContainer = $('section.gallery');

            Canvas.init(canvasContainer);
            canvasContainer.find('div.canvas-buttons').append(
                $('<button>', {type: 'button', text: 'Назад'}).on('click', function () {
                    canvasContainer.fadeOut(function () {
                        galleryContainer.fadeIn(function () {
                            location.reload();
                        });
                    });
                })
            );

            initEditButtons(galleryContainer);
        }
    });
})(Gallery = window.Gallery || {}, Canvas, $);
