function clearFormContent(formId) {
    //查找对应表单下所有含有name属性的元素，并进行遍历
    $("#" + formId).find("[name]").each(function () {
        switch (this.type) {
            case "radio":
            case "checkbox":
                //如果是单选框或者复选框，去除checked属性
                this.removeAttribute('checked');
                break;
            case "select-one":
            case "select-multiple":
                var target = $(this);
                //如果是下拉框，清除它的所有选中了的子option元素的selected属性
                if (target.hasClass('selectpicker')) {
                    //如果是selectpicker
                    target.selectpicker('val', '');
                } else {
                    //如果是普通下拉框
                    target.val('');
                }
                break;
            default:
                //如果是其它的控件，将它的值置空
                this.value = null;
                break;
        }
    });
}

function operateDialog(dialogId,modal) {
    $('#' + dialogId).modal(modal);
}