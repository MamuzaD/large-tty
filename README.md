# large-tty

similar to large-type.com, simple input and then large text output.
however this app will be served over ssh, so anyone can simply do
`ssh large-tty.com` and access the tui app.

## tech stack

- language: go
- framework: charm bubbletea
- ssh: charm wish ?
- hosting: railway ? or some vps

## ui

- should be simple, with the top center just saying `large-tty`
  below that, the input box, and then the output
- need to figure out how to do the large typing, most likely figlet
- need to make sure that the large text output is centered, and dynamic to
  the user's terminal size. it should wrap properly, and eventually shrink
  in size if too large and would not fit on one terminal size.
- maybe add a settings that the user can access to change the font family/size
