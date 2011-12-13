describe('edge cases', function(){

        it('allows triggering of actions', function(){

            var checkedRadioID = function(){
                return $('#trigger_test input:checked').attr('id');
            };
            
            expect( checkedRadioID() ).toEqual( 'radio_2' );
            $('#radio_3').trigger('click');
            expect( checkedRadioID() ).toEqual( 'radio_3' );

        });

});