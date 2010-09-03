describe 'Core'

  it 'should set up the namespace "App"'
    App.should.be_an Object
  end
  
  it 'should be able to call "App.log"'
    App.log.should.be_a Function
  end
  
end