
        $(document).ready(function () {
            $("#CKEditorButton").click(function () {
                openEditor('CKEditorInputTag',$(this).html());
            });
        });
        function showButtonLabels() {
            setTimeout(() => {
                $('.cke_button__abbr_label').attr('style', 'display:inline');
                $('.cke_button__closeeditor_label').attr('style', 'display:inline');
            }, 100)
        }
        function openEditor(inputTag,inputdata) {
            if (typeof CKEDITOR.instances['CKEditorInputTag2'] == 'undefined') {
                inputData =$('#CKEditorInputTag').html();
                $('#CKEditorInputTag').html('')
                $('#CKEditorInputTag').prepend("<div id='CKEditorInputTag1'></div>");
                $('#CKEditorInputTag').prepend("<div id='CKEditorInputTag2'></div>");
                $('#CKEditorInputTag1').html(inputData);
                $('#CKEditorInputTag1').attr('style','background: lightskyblue;');
                $('#CKEditorInputTag2').html(inputData);

                var editor = CKEDITOR.replace('CKEditorInputTag2', { extraPlugins: 'abbr,closeEditor', dialog: 'AADialog', allowedContent: true, dialog_noConfirmCancel: true });
                showButtonLabels();
                editor.on('change',function(e){
                    let htmlData=e.editor.getData()
                    $('#CKEditorInputTag1').html(htmlData.replace(/></g, '>\n<').replace(/        /g, ''));
                })
            }

        }
        //openEditor('');
        CKEDITOR.dialog.add('AADialog', function (editor) {
            return {
                title: 'Attribute Properties',
                minWidth: 400,
                minHeight: 200,
                contents: [
                    {
                        id: 'tab-basic',
                        label: 'Add New Attribute',
                        elements: [
                            {
                                type: 'text',
                                id: 'defaultValue',
                                label: 'Default Value',
                                validate: CKEDITOR.dialog.validate.notEmpty("Default Value cannot be empty."),
                                setup: function (element) {
                                    this.setValue(element.getText());
                                },
                            },
                            {
                                type: 'text',
                                id: 'attributeName',
                                label: 'Attribute Name',
                                default: 'th:text',
                                validate: CKEDITOR.dialog.validate.notEmpty("Attribute Name cannot be empty."),
                            },
                            {
                                type: 'text',
                                id: 'attributeValue',
                                label: 'Attribute Value',
                                default: '${object.name}',
                                validate: CKEDITOR.dialog.validate.notEmpty("Attribute Value cannot be empty."),
                            },
                            {
                                type: 'button',
                                id: 'addAttribute',
                                label: 'Add Attribute',
                                items: [],
                                onClick: function (element) {
                                    var temp_text = CKEDITOR.dialog.getCurrent().getContentElement('tab-basic', 'attributeName').getValue();

                                    [...Array(editor.getSelection().getStartElement().$.attributes.length).keys()].forEach(a => {
                                        CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').remove(0);
                                    });
                                    var dialog = CKEDITOR.dialog.getCurrent();
                                    var abbr = CKEDITOR.dialog.getCurrent().element;
                                    abbr.setAttribute(dialog.getContentElement('tab-basic', 'attributeName').getValue(),
                                        dialog.getContentElement('tab-basic', 'attributeValue').getValue())
                                    abbr.setText(dialog.getContentElement('tab-basic', 'defaultValue').getValue())
                                    if (CKEDITOR.dialog.getCurrent().insertMode) {
                                        if (CKEDITOR.dialog.getCurrent().insertcount == 0) {
                                            editor.insertElement(abbr);
                                            window.alert(temp_text + '  attribute created')
                                            CKEDITOR.dialog.getCurrent().insertedAtributes.push(dialog.getContentElement('tab-basic', 'attributeName').getValue());
                                            CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').add(dialog.getContentElement('tab-basic', 'attributeName').getValue());
                                        } else {
                                            if (!CKEDITOR.dialog.getCurrent().insertedAtributes.some(a => a === dialog.getContentElement('tab-basic', 'attributeName').getValue())) {
                                                CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').add(dialog.getContentElement('tab-basic', 'attributeName').getValue());
                                                CKEDITOR.dialog.getCurrent().insertedAtributes.push(dialog.getContentElement('tab-basic', 'attributeName').getValue());
                                            }

                                        }
                                        CKEDITOR.dialog.getCurrent().insertcount++;
                                        CKEDITOR.dialog.getCurrent().getButton('cancel').click();
                                    } else {
                                        if (!CKEDITOR.dialog.getCurrent().insertedAtributes.some(a => a === dialog.getContentElement('tab-basic', 'attributeName').getValue())) {
                                            CKEDITOR.dialog.getCurrent().insertedAtributes.push(dialog.getContentElement('tab-basic', 'attributeName').getValue());
                                            window.alert(temp_text + '  attribute created')
                                        }else{
                                            window.alert(temp_text + '  attribute Already Present ,TO modify goto Modify Tab')
                                        }
                                        [...Array(editor.getSelection().getStartElement().$.attributes.length).keys()].forEach(a => {
                                            CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').add(editor.getSelection().getStartElement().$.attributes[a].name);
                                        });
                                        if (CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').getValue()) {
                                            CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'atributeValueToChange')
                                                .setValue(editor.getSelection().getStartElement().$.attributes[CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').getValue()].value)
                                        }
                                    }
                                },
                            },
                        ]
                    },
                    {
                        id: 'tab-adv',
                        label: 'Modify Attribute',
                        elements: [
                            {
                                type: 'select',
                                id: 'selectedTag',
                                label: 'Select the Attribute',
                                items: [],
                                onChange: function (element) {
                                    CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'atributeValueToChange')
                                        .setValue(editor.getSelection().getStartElement().$.attributes[element.data.value].value)
                                },
                            },
                            {
                                type: 'button',
                                id: 'deleteAttribute',
                                label: 'DeleteAttribute',
                                items: [],
                                onClick: function (element) {
                                    var temp_text = CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').getValue();
                                    CKEDITOR.dialog.getCurrent().insertedAtributes.splice(CKEDITOR.dialog.getCurrent().insertedAtributes.indexOf(temp_text),1)
                                    editor.getSelection().getStartElement().removeAttribute(CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').getValue());
                                    [...Array(editor.getSelection().getStartElement().$.attributes.length + 1).keys()].forEach(a => {
                                        CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').remove('a');
                                    });
                                    if (editor.getSelection().getStartElement().$.attributes.length === 0) {

                                    }
                                    [...Array(editor.getSelection().getStartElement().$.attributes.length).keys()].forEach(a => {
                                        CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').add(editor.getSelection().getStartElement().$.attributes[a].name);
                                    });
                                    if (CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').getValue()) {
                                        CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'atributeValueToChange')
                                            .setValue(editor.getSelection().getStartElement().$.attributes[CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').getValue()].value)
                                    } else {
                                        CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'atributeValueToChange')
                                            .setValue('')
                                    }
                                    window.alert(temp_text + '  attribute deleted')
                                },
                            },
                            {
                                type: 'text',
                                id: 'atributeValueToChange',
                                label: 'Attribute Value',
                                setup: function (element) {
                                    if (element.$.attributes.length)
                                        this.setValue(element.$.attributes[0].value)
                                },
                            },
                            {
                                type: 'button',
                                id: 'updateAttribute',
                                label: 'Update Attribute',
                                items: [],
                                onClick: function (element) {
                                    var temp_text = CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').getValue();
                                    editor.getSelection().getStartElement().setAttribute(CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').getValue(), CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'atributeValueToChange').getValue());
                                    [...Array(editor.getSelection().getStartElement().$.attributes.length).keys()].forEach(a => {
                                        CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').remove('a');
                                    });
                                    if (editor.getSelection().getStartElement().$.attributes.length === 0) {

                                    }
                                    [...Array(editor.getSelection().getStartElement().$.attributes.length).keys()].forEach(a => {
                                        CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').add(editor.getSelection().getStartElement().$.attributes[a].name);
                                    });
                                    if (CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').getValue()) {
                                        CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'atributeValueToChange')
                                            .setValue(editor.getSelection().getStartElement().$.attributes[CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').getValue()].value)
                                    }
                                    window.alert(temp_text + '  attribute Updated')
                                },
                            },
                        ]
                    },
                    {
                        id: 'tab-mod',
                        label: 'Pick from Existing',
                        elements: [
                            {
                                type: 'text',
                                id: 'id',
                                label: 'Id'
                            }
                        ]
                    }
                ],
                onShow: function () {

                    this.insertedAtributes = [];
                    [...Array(editor.getSelection().getStartElement().$.attributes.length).keys()].forEach(a => {
                        CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').add(editor.getSelection().getStartElement().$.attributes[a].name);
                        this.insertedAtributes.push(editor.getSelection().getStartElement().$.attributes[a].name);
                    });
                    this.insertcount = 0;

                    // Get the selection from the editor.
                    var selection = editor.getSelection();
                    // Get the element at the start of the selection.
                    var element = selection.getStartElement();
                    // Get the <abbr> element closest to the selection, if it exists.
                    var tempText = element.$.innerText;
                    console.log('type',element.$.localName)
                    if (element && element.$.localName!=='input')
                        element = element.getAscendant('span', true);

                    // Create a new <abbr> element if it does not exist.
                    if (!element || element.getName() != 'span') {
                        if (!element ){
                            element = editor.document.createElement('span');
                            // Flag the insertion mode for later use.
                            this.insertMode = true;
                        }
                            
                    }
                    else
                        this.insertMode = false;
                    // Store the reference to the <abbr> element in an internal property, for later use.
                    this.element = element;
                    // Invoke the setup methods of all dialog window elements, so they can load the element attributes.
                    if (!this.insertMode)
                        this.setupContent(this.element);
                },
                onCancel: function () {
                    if (CKEDITOR.dialog.getCurrent().insertMode) {
                        [...Array(this.insertedAtributes.length).keys()].forEach(a => {
                            CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').remove(0);
                        });
                    } else {
                        [...Array(editor.getSelection().getStartElement().$.attributes.length).keys()].forEach(a => {
                            CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').remove(0);
                        });
                    }
                },
                onOk: function () {
                    if (CKEDITOR.dialog.getCurrent().insertMode) {
                        [...Array(this.insertcount).keys()].forEach(a => {
                            CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').remove(0);
                        });
                    } else {
                        [...Array(editor.getSelection().getStartElement().$.attributes.length).keys()].forEach(a => {
                            CKEDITOR.dialog.getCurrent().getContentElement('tab-adv', 'selectedTag').remove(0);
                        });
                    }
                    // var dialog = this;
                    // var abbr = this.element;
                    // abbr.setAttribute(dialog.getValueOf('tab-basic', 'attributeName'),
                    //     dialog.getValueOf('tab-basic', 'attributeValue'))
                    // abbr.setText(dialog.getValueOf('tab-basic', 'defaultValue'))
                    // if (this.insertMode)
                    //     editor.insertElement(abbr)
                }
            };
        });

        CKEDITOR.plugins.add('abbr', {
            init: function (editor) {
                editor.addCommand('abbr', new CKEDITOR.dialogCommand('AADialog'));
                editor.ui.addButton('Abbr', {
                    label: 'Add Atribute',
                    command: 'abbr',
                    toolbar: 'insert'
                });
            }
        });

        CKEDITOR.plugins.add('closeEditor', {
            init: function (editor) {
                editor.addCommand('closeEditor', {
                    exec: function (editor) {
                        setTimeout(function () {
                            CKEDITOR.instances['CKEditorInputTag2'].destroy();
                            var temp = $('#CKEditorInputTag2').html();
                            $('#CKEditorInputTag').html(temp);
                        });
                    }
                });
                editor.ui.addButton('CloseEditor', {
                    label: 'Close Editor',
                    command: 'closeEditor',
                    toolbar: 'insert'
                });
            }
        });


