describe('edge cases', function(){

        it('toggles radio buttons', function(){

            var checkedRadioID = function(){
                return $('#radio_trigger_test input:checked').attr('id');
            };
            
            expect( checkedRadioID() ).toEqual( 'radio_2' );
            
            $('#radio_3').trigger('click');

            expect( $('#radio_3').is(':checked') ).toBeTruthy(); // passes
            expect( checkedRadioID() ).toEqual( 'radio_3' ); // fails

        });

        it('reacts to click events', function(){

            var clicked = false;

            runs(function(){
                $('#click_test').click(function(){
                    clicked = true;
                });

                $('#click_test').trigger('click');
            });

            waits(10);

            runs(function(){
                expect(clicked).toBeTruthy();
            });
        });

        it('returns the value of a select correctly', function(){
            var $select = $('#select_test select');
            $select.val('one');
            expect( $select[0].type ).toEqual('select-one');
            expect( $select.val() ).toEqual('one');
        });

});