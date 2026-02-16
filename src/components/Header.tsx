export const Header = () => {
    const logo = 'src/img/logo.png'
    return (
        <header className="my-3">
            <img src={logo} alt="RPG Notes to Obsidian.md" className="w-50" />
        </header>
    )
}