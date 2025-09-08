using Lab01.C__Classes;

namespace TestLab01
{
    public class UnitTest1
    {
        [Fact]
        public void Success1()
        {
            Person stormBorn = new Person("Daenerys", "Targaryen", 25);
            Assert.NotNull(stormBorn);
            Assert.Equal("Daenerys Targaryen", stormBorn.getFullName());
            Assert.True(stormBorn.isAdult());
        }

        public void Fail1()
        {
            Person stormBorn = new Person("Daenerys", "Targaryen", 25);
            Assert.False(stormBorn.isAdult());
        }
    }
}
