# This Awk scripts scans a Markdown source file for code blocks that match the
# Entangled syntax for defining named code blocks, and then inserts a piece
# of raw HTML to label these code blocks.

# This matches "``` {.julia #my-code}"
match($0, /``` *{[^#}]*#([a-zA-Z0-9\-_]+)[^}]*\}/, a) {
        if (!(a[1] in counts))
            counts[a[1]] = 0

        term = counts[a[1]] == 0 ? "≣" : "⊞"

        print "```@raw html"
        print "<div class=\"noweb-label\">⪡" a[1] "⪢" term "</div>"
        print "```"
        counts[a[1]] = counts[a[1]] + 1
}

# This matches "``` {.julia file=src/my-file.jl}"
match($0, /``` *{[^}]*file=([a-zA-Z0-9\-_\.\/\\]+)[^}]*}/, a) {
        print "```@raw html"
        print "<div class=\"noweb-label\">file:<i>" a[1] "</i></div>"
        print "```"
}

# Print everything else too
{
    print
}
