// ~\~ language=Rust filename=src/lib.rs
// ~\~ begin <<lit/day01.md|src/lib.rs>>[init]
mod aoc {
    pub enum Error {
        Input(String)
    }

    pub type Result<T> = std::Result<T, Error>;
}
// ~\~ end
