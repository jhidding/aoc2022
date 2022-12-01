// ~\~ language=Rust filename=src/aoc.rs
// ~\~ begin <<docs/src/day01.md|src/aoc.rs>>[init]
#[derive(Debug)]
pub enum Error {
    Input(String)
}

pub type Result<T> = core::result::Result<T, Error>;

pub fn input_error<T>(err:T) -> Error where T: core::fmt::Debug {
    Error::Input(format!("{:?}", err))
}
// ~\~ end
