/*
 * curriculum.js — the ENTIRE course as data.
 *
 * Adding content = editing this file only. No new components required.
 *
 * A unit:   { id, title, blurb, color, nodes: [...] }
 * A node is one of:
 *   LESSON     { id, type:'lesson', title, xp, screens:[{ title, body, example? }] }
 *              example: { code, caption? } — a runnable snippet the learner can tweak.
 *   CHALLENGE  { id, type:'challenge', title, xp, difficulty, prompt, starterCode,
 *                hints:[], checkType:'return'|'stdout',
 *                functionName? (required for 'return'),
 *                testCases:[ {args,expected} | {stdin?,expected} ] }
 *
 * For 'return' challenges, testCases use { args:[...], expected }.
 * For 'stdout' challenges, testCases use { stdin?: "lines\\njoined", expected: "text" }.
 * Output comparison for stdout is whitespace-trimmed and lenient on trailing newlines.
 */

export const curriculum = [
  // ───────────────────────────── UNIT 1 ─────────────────────────────
  {
    id: 'u1',
    title: 'Hello Python',
    blurb: 'Your very first lines of code.',
    color: '#58cc02',
    nodes: [
      {
        id: 'u1-l1',
        type: 'lesson',
        title: 'Meet print()',
        xp: 10,
        screens: [
          {
            title: 'Saying hello',
            body: "Python runs your instructions top to bottom. The print() function shows text on the screen. Whatever you put inside the quotes gets displayed.",
            example: {
              code: 'print("Hello, World!")\nprint("I am learning Python")',
              caption: 'Press Run to see both lines appear.',
            },
          },
          {
            title: 'Comments',
            body: "A line starting with # is a comment. Python ignores it — comments are notes for humans. Use them to explain your code.",
            example: {
              code: '# This line is ignored\nprint("Comments are handy!")  # so is this part',
            },
          },
        ],
      },
      {
        id: 'u1-c1',
        type: 'challenge',
        title: 'Hello, World!',
        xp: 20,
        difficulty: 'Intro',
        prompt: "Every programmer's first program. Print exactly:\n\nHello, World!",
        starterCode: '# Print the classic greeting\n',
        hints: ['Use the print() function.', 'Text goes inside "double quotes".'],
        checkType: 'stdout',
        testCases: [{ expected: 'Hello, World!' }],
      },
      {
        id: 'u1-l2',
        type: 'lesson',
        title: 'Variables & types',
        xp: 10,
        screens: [
          {
            title: 'Storing values',
            body: "A variable is a labeled box that holds a value. Use = to put a value in it. You can use the variable later by its name.",
            example: {
              code: 'name = "Ada"\nage = 36\nprint(name)\nprint(age)',
            },
          },
          {
            title: 'Basic types',
            body: "Python values have types: int (whole numbers), float (decimals), str (text), and bool (True/False). You don't declare the type — Python figures it out.",
            example: {
              code: 'count = 7          # int\nprice = 3.5        # float\nlabel = "apples"   # str\nin_stock = True    # bool\nprint(count, price, label, in_stock)',
            },
          },
        ],
      },
      {
        id: 'u1-c2',
        type: 'challenge',
        title: 'Greet a friend',
        xp: 25,
        difficulty: 'Easy',
        prompt:
          'Read a name from input and greet them. If the input is "Sam", print:\n\nHello, Sam!\n\nUse input() to read the name.',
        starterCode: 'name = input()\n# Now print the greeting\n',
        hints: ['input() gives you the typed text as a string.', 'You can build the line with "Hello, " + name + "!".'],
        checkType: 'stdout',
        testCases: [
          { stdin: 'Sam', expected: 'Hello, Sam!' },
          { stdin: 'Grace', expected: 'Hello, Grace!' },
        ],
      },
    ],
  },

  // ───────────────────────────── UNIT 2 ─────────────────────────────
  {
    id: 'u2',
    title: 'Numbers & Strings',
    blurb: 'Math, f-strings, and slicing text.',
    color: '#1cb0f6',
    nodes: [
      {
        id: 'u2-l1',
        type: 'lesson',
        title: 'Arithmetic',
        xp: 10,
        screens: [
          {
            title: 'Doing math',
            body: 'Python does math with + - * /. Use // for integer division, % for remainder, and ** for powers.',
            example: {
              code: 'print(7 + 2)\nprint(7 / 2)    # 3.5\nprint(7 // 2)   # 3\nprint(7 % 2)    # 1\nprint(2 ** 5)   # 32',
            },
          },
          {
            title: 'Type conversion',
            body: 'input() always gives a string. To do math on it, convert with int() or float(). Convert back to text with str().',
            example: {
              code: 'text = "10"\nn = int(text)\nprint(n + 5)   # 15',
            },
          },
        ],
      },
      {
        id: 'u2-c1',
        type: 'challenge',
        title: 'Add two numbers',
        xp: 25,
        difficulty: 'Easy',
        prompt:
          'Two integers are given on two separate lines. Print their sum.\n\nFor input 4 then 6, print:\n\n10',
        starterCode: 'a = int(input())\nb = int(input())\n# Print the sum\n',
        hints: ['Convert each input with int().', 'print(a + b)'],
        checkType: 'stdout',
        testCases: [
          { stdin: '4\n6', expected: '10' },
          { stdin: '100\n-7', expected: '93' },
        ],
      },
      {
        id: 'u2-l2',
        type: 'lesson',
        title: 'f-strings & string methods',
        xp: 10,
        screens: [
          {
            title: 'f-strings',
            body: 'An f-string lets you drop variables straight into text. Put an f before the quote and wrap variables in {curly braces}.',
            example: {
              code: 'name = "Sam"\nscore = 95\nprint(f"{name} scored {score} points")',
            },
          },
          {
            title: 'String methods & slicing',
            body: 'Strings have handy methods: .upper(), .lower(), .strip(), .split(). You can also index s[0] and slice s[1:4].',
            example: {
              code: 's = "python"\nprint(s.upper())     # PYTHON\nprint(s[0])          # p\nprint(s[1:4])        # yth\nprint("a,b,c".split(","))  # [\'a\', \'b\', \'c\']',
            },
          },
        ],
      },
      {
        id: 'u2-c2',
        type: 'challenge',
        title: 'Shout it',
        xp: 25,
        difficulty: 'Easy',
        prompt:
          'Read one word and print it in ALL CAPS.\n\nFor input "hello", print:\n\nHELLO',
        starterCode: 'word = input()\n# Print the uppercase version\n',
        hints: ['Strings have an .upper() method.', 'print(word.upper())'],
        checkType: 'stdout',
        testCases: [
          { stdin: 'hello', expected: 'HELLO' },
          { stdin: 'PyQuest', expected: 'PYQUEST' },
        ],
      },
      {
        id: 'u2-c3',
        type: 'challenge',
        title: 'Count the words',
        xp: 30,
        difficulty: 'Easy',
        prompt:
          'Read a sentence and print how many words it has (words are separated by spaces).\n\nFor input "the quick brown fox", print:\n\n4',
        starterCode: 'sentence = input()\n# How many words?\n',
        hints: ['.split() breaks a string into a list of words.', 'len(...) gives the length of a list.'],
        checkType: 'stdout',
        testCases: [
          { stdin: 'the quick brown fox', expected: '4' },
          { stdin: 'hello world', expected: '2' },
          { stdin: 'one', expected: '1' },
        ],
      },
    ],
  },

  // ───────────────────────────── UNIT 3 ─────────────────────────────
  {
    id: 'u3',
    title: 'Logic',
    blurb: 'Booleans, comparisons, and if/elif/else.',
    color: '#ce82ff',
    nodes: [
      {
        id: 'u3-l1',
        type: 'lesson',
        title: 'Making decisions',
        xp: 10,
        screens: [
          {
            title: 'Comparisons',
            body: 'Comparisons produce a bool (True/False): == equal, != not equal, < > <= >=. Combine them with and, or, not.',
            example: {
              code: 'print(3 < 5)         # True\nprint(3 == 5)        # False\nprint(3 < 5 and 5 < 4)  # False',
            },
          },
          {
            title: 'if / elif / else',
            body: 'Use if to run code only when a condition is True. elif checks another condition; else catches everything left. Indentation (4 spaces) marks the block.',
            example: {
              code: 'n = 7\nif n > 0:\n    print("positive")\nelif n < 0:\n    print("negative")\nelse:\n    print("zero")',
            },
          },
        ],
      },
      {
        id: 'u3-c1',
        type: 'challenge',
        title: 'Even or odd',
        xp: 30,
        difficulty: 'Easy',
        prompt:
          'Read an integer. Print "even" if it is even, otherwise "odd".\n\nFor input 4, print:\n\neven',
        starterCode: 'n = int(input())\n# even or odd?\n',
        hints: ['A number is even when n % 2 == 0.', 'Use if / else.'],
        checkType: 'stdout',
        testCases: [
          { stdin: '4', expected: 'even' },
          { stdin: '7', expected: 'odd' },
          { stdin: '0', expected: 'even' },
        ],
      },
      {
        id: 'u3-c2',
        type: 'challenge',
        title: 'Sign of a number',
        xp: 30,
        difficulty: 'Easy',
        prompt:
          'Read an integer and print "positive", "negative", or "zero".\n\nFor input -3, print:\n\nnegative',
        starterCode: 'n = int(input())\n# positive / negative / zero\n',
        hints: ['Three cases — use if / elif / else.', 'Zero is neither positive nor negative.'],
        checkType: 'stdout',
        testCases: [
          { stdin: '10', expected: 'positive' },
          { stdin: '-3', expected: 'negative' },
          { stdin: '0', expected: 'zero' },
        ],
      },
      {
        id: 'u3-c3',
        type: 'challenge',
        title: 'Biggest of three',
        xp: 35,
        difficulty: 'Medium',
        prompt:
          'Three integers are given, one per line. Print the largest.\n\nFor 4, 9, 2 print:\n\n9',
        starterCode: 'a = int(input())\nb = int(input())\nc = int(input())\n# Print the largest\n',
        hints: ['You can compare with if/elif, or use the built-in max().', 'max(a, b, c) returns the biggest.'],
        checkType: 'stdout',
        testCases: [
          { stdin: '4\n9\n2', expected: '9' },
          { stdin: '5\n5\n1', expected: '5' },
          { stdin: '-1\n-9\n-3', expected: '-1' },
        ],
      },
    ],
  },

  // ───────────────────────────── UNIT 4 ─────────────────────────────
  {
    id: 'u4',
    title: 'Loops',
    blurb: 'Repeat work with for and while.',
    color: '#ff9600',
    nodes: [
      {
        id: 'u4-l1',
        type: 'lesson',
        title: 'for & range',
        xp: 10,
        screens: [
          {
            title: 'Looping with for',
            body: 'A for loop repeats once per item. range(n) gives the numbers 0,1,...,n-1. range(a, b) goes from a up to b-1.',
            example: {
              code: 'for i in range(5):\n    print(i)\n\nfor letter in "hi":\n    print(letter)',
            },
          },
          {
            title: 'while, break, continue',
            body: 'A while loop runs as long as its condition is True. break exits the loop early; continue skips to the next iteration.',
            example: {
              code: 'n = 0\nwhile n < 3:\n    print(n)\n    n += 1',
            },
          },
        ],
      },
      {
        id: 'u4-c1',
        type: 'challenge',
        title: 'Count to N',
        xp: 30,
        difficulty: 'Easy',
        prompt:
          'Read an integer n and print every number from 1 to n, one per line.\n\nFor input 3, print:\n\n1\n2\n3',
        starterCode: 'n = int(input())\n# Print 1 to n\n',
        hints: ['range(1, n + 1) gives 1..n.', 'print() inside the loop prints each on its own line.'],
        checkType: 'stdout',
        testCases: [
          { stdin: '3', expected: '1\n2\n3' },
          { stdin: '1', expected: '1' },
          { stdin: '5', expected: '1\n2\n3\n4\n5' },
        ],
      },
      {
        id: 'u4-c2',
        type: 'challenge',
        title: 'Sum to N',
        xp: 35,
        difficulty: 'Easy',
        prompt:
          'Read an integer n and print the sum 1 + 2 + ... + n.\n\nFor input 5, print:\n\n15',
        starterCode: 'n = int(input())\ntotal = 0\n# Add up 1..n, then print total\n',
        hints: ['Keep a running total inside the loop.', 'total = total + i, or total += i.'],
        checkType: 'stdout',
        testCases: [
          { stdin: '5', expected: '15' },
          { stdin: '1', expected: '1' },
          { stdin: '10', expected: '55' },
        ],
      },
      {
        id: 'u4-c3',
        type: 'challenge',
        title: 'FizzBuzz',
        xp: 45,
        difficulty: 'Medium',
        prompt:
          'For numbers 1 to n: print "Fizz" if divisible by 3, "Buzz" if divisible by 5, "FizzBuzz" if divisible by both, otherwise the number.\n\nFor input 5, print:\n\n1\n2\nFizz\n4\nBuzz',
        starterCode: 'n = int(input())\n# Classic FizzBuzz from 1 to n\n',
        hints: ['Check divisible-by-both FIRST (15), then 3, then 5.', 'x % 3 == 0 means divisible by 3.'],
        checkType: 'stdout',
        testCases: [
          { stdin: '5', expected: '1\n2\nFizz\n4\nBuzz' },
          { stdin: '15', expected: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' },
        ],
      },
    ],
  },

  // ───────────────────────────── UNIT 5 ─────────────────────────────
  {
    id: 'u5',
    title: 'Collections',
    blurb: 'Lists, tuples, dicts, and sets.',
    color: '#00cd9c',
    nodes: [
      {
        id: 'u5-l1',
        type: 'lesson',
        title: 'Lists',
        xp: 10,
        screens: [
          {
            title: 'Ordered collections',
            body: 'A list holds many values in order. Index with [0], append with .append(), get length with len(). Loop over it with for.',
            example: {
              code: 'nums = [3, 1, 4]\nnums.append(1)\nprint(nums)        # [3, 1, 4, 1]\nprint(nums[0])     # 3\nprint(len(nums))   # 4',
            },
          },
          {
            title: 'Dicts, sets & tuples',
            body: 'A dict maps keys to values: d["a"] = 1. A set holds unique values. A tuple is a fixed, unchangeable list written with parentheses.',
            example: {
              code: 'ages = {"sam": 20, "ana": 22}\nprint(ages["ana"])      # 22\nprint(set([1, 1, 2, 3]))  # {1, 2, 3}\npoint = (3, 4)\nprint(point[1])         # 4',
            },
          },
        ],
      },
      {
        id: 'u5-c1',
        type: 'challenge',
        title: 'Sum a list',
        xp: 35,
        difficulty: 'Easy',
        prompt:
          'A line of space-separated integers is given. Print their sum.\n\nFor input "3 1 4 1 5", print:\n\n14',
        starterCode: 'nums = [int(x) for x in input().split()]\n# Print the total\n',
        hints: ['The starter already turns the line into a list of ints.', 'The built-in sum() adds a list for you.'],
        checkType: 'stdout',
        testCases: [
          { stdin: '3 1 4 1 5', expected: '14' },
          { stdin: '10', expected: '10' },
          { stdin: '-2 2 -2 2', expected: '0' },
        ],
      },
      {
        id: 'u5-c2',
        type: 'challenge',
        title: 'Unique words',
        xp: 40,
        difficulty: 'Medium',
        prompt:
          'Read a line of words and print how many DISTINCT words it contains.\n\nFor input "a b a c b", print:\n\n3',
        starterCode: 'words = input().split()\n# Count distinct words\n',
        hints: ['A set automatically removes duplicates.', 'len(set(words))'],
        checkType: 'stdout',
        testCases: [
          { stdin: 'a b a c b', expected: '3' },
          { stdin: 'hi hi hi', expected: '1' },
          { stdin: 'one two three', expected: '3' },
        ],
      },
      {
        id: 'u5-c3',
        type: 'challenge',
        title: 'Most common letter',
        xp: 45,
        difficulty: 'Medium',
        prompt:
          'Read a word and print the letter that appears most often. If there is a tie, print the one that comes first alphabetically.\n\nFor input "banana", print:\n\na',
        starterCode: 'word = input()\n# Use a dict to count letters\n',
        hints: ['Build a dict mapping each letter to its count.', 'To break ties, consider sorting the items by (-count, letter).'],
        checkType: 'stdout',
        testCases: [
          { stdin: 'banana', expected: 'a' },
          { stdin: 'apple', expected: 'p' },
          { stdin: 'abc', expected: 'a' },
        ],
      },
    ],
  },

  // ───────────────────────────── UNIT 6 ─────────────────────────────
  {
    id: 'u6',
    title: 'Functions',
    blurb: 'Package logic you can reuse.',
    color: '#ff4b4b',
    nodes: [
      {
        id: 'u6-l1',
        type: 'lesson',
        title: 'def & return',
        xp: 10,
        screens: [
          {
            title: 'Defining a function',
            body: 'A function packages code under a name. Define it with def, give it parameters in (), and hand back a result with return. Call it by name.',
            example: {
              code: 'def square(x):\n    return x * x\n\nprint(square(5))   # 25\nprint(square(3))   # 9',
            },
          },
          {
            title: 'Return vs print',
            body: 'return hands a value back to whoever called the function — that is what the auto-grader checks. print only shows text. From here on, challenges ask you to RETURN a value.',
            example: {
              code: 'def add(a, b):\n    return a + b\n\nresult = add(2, 3)\nprint(result)   # 5',
            },
          },
        ],
      },
      {
        id: 'u6-c1',
        type: 'challenge',
        title: 'Add two numbers',
        xp: 35,
        difficulty: 'Easy',
        prompt:
          'Write a function add(a, b) that RETURNS the sum of a and b.\n\nadd(2, 3) should return 5.',
        starterCode: 'def add(a, b):\n    # return the sum\n    pass\n',
        hints: ['Replace pass with a return statement.', 'return a + b'],
        checkType: 'return',
        functionName: 'add',
        testCases: [
          { args: [2, 3], expected: 5 },
          { args: [-1, 1], expected: 0 },
          { args: [100, 250], expected: 350 },
        ],
      },
      {
        id: 'u6-l2',
        type: 'lesson',
        title: 'Default arguments',
        xp: 10,
        screens: [
          {
            title: 'Defaults',
            body: 'A parameter can have a default value used when the caller leaves it out. Defaults go last in the parameter list.',
            example: {
              code: 'def power(base, exp=2):\n    return base ** exp\n\nprint(power(5))     # 25\nprint(power(2, 3))  # 8',
            },
          },
        ],
      },
      {
        id: 'u6-c2',
        type: 'challenge',
        title: 'Power with a default',
        xp: 40,
        difficulty: 'Medium',
        prompt:
          'Write power(base, exp=2) that RETURNS base raised to exp. When exp is omitted, square the base.\n\npower(5) → 25, power(2, 3) → 8.',
        starterCode: 'def power(base, exp=2):\n    # return base ** exp\n    pass\n',
        hints: ['Give exp a default of 2 in the signature.', 'Use the ** operator.'],
        checkType: 'return',
        functionName: 'power',
        testCases: [
          { args: [5], expected: 25 },
          { args: [2, 3], expected: 8 },
          { args: [10, 0], expected: 1 },
        ],
      },
      {
        id: 'u6-c3',
        type: 'challenge',
        title: 'Greeting builder',
        xp: 40,
        difficulty: 'Medium',
        prompt:
          'Write greet(name) that RETURNS the string "Hello, NAME!" (note the comma and exclamation mark).\n\ngreet("Sam") → "Hello, Sam!"',
        starterCode: 'def greet(name):\n    # return the greeting string\n    pass\n',
        hints: ['An f-string is perfect here.', 'return f"Hello, {name}!"'],
        checkType: 'return',
        functionName: 'greet',
        testCases: [
          { args: ['Sam'], expected: 'Hello, Sam!' },
          { args: ['Grace'], expected: 'Hello, Grace!' },
        ],
      },
    ],
  },

  // ───────────────────────────── UNIT 7 ─────────────────────────────
  {
    id: 'u7',
    title: 'Pythonic Patterns',
    blurb: 'Comprehensions, enumerate, zip, in.',
    color: '#a560ff',
    nodes: [
      {
        id: 'u7-l1',
        type: 'lesson',
        title: 'List comprehensions',
        xp: 10,
        screens: [
          {
            title: 'Build lists in one line',
            body: 'A comprehension creates a new list from an existing one: [expr for item in iterable if condition]. It replaces a loop-and-append.',
            example: {
              code: 'squares = [x * x for x in range(5)]\nprint(squares)   # [0, 1, 4, 9, 16]\n\nevens = [x for x in range(10) if x % 2 == 0]\nprint(evens)     # [0, 2, 4, 6, 8]',
            },
          },
          {
            title: 'enumerate, zip & in',
            body: 'enumerate gives index + value while looping. zip pairs up two lists. The in operator checks membership.',
            example: {
              code: 'for i, c in enumerate("ab"):\n    print(i, c)\n\nfor a, b in zip([1, 2], [3, 4]):\n    print(a + b)\n\nprint(3 in [1, 2, 3])   # True',
            },
          },
        ],
      },
      {
        id: 'u7-c1',
        type: 'challenge',
        title: 'Squares',
        xp: 40,
        difficulty: 'Easy',
        prompt:
          'Write squares(n) that RETURNS a list of the squares 0², 1², …, (n-1)².\n\nsquares(4) → [0, 1, 4, 9]',
        starterCode: 'def squares(n):\n    # return a list of squares\n    pass\n',
        hints: ['Use a list comprehension over range(n).', '[x * x for x in range(n)]'],
        checkType: 'return',
        functionName: 'squares',
        testCases: [
          { args: [4], expected: [0, 1, 4, 9] },
          { args: [1], expected: [0] },
          { args: [0], expected: [] },
        ],
      },
      {
        id: 'u7-c2',
        type: 'challenge',
        title: 'Only the evens',
        xp: 40,
        difficulty: 'Medium',
        prompt:
          'Write evens(nums) that RETURNS a new list with only the even numbers, in their original order.\n\nevens([1, 2, 3, 4]) → [2, 4]',
        starterCode: 'def evens(nums):\n    # keep only even numbers\n    pass\n',
        hints: ['Filter with an if inside the comprehension.', '[x for x in nums if x % 2 == 0]'],
        checkType: 'return',
        functionName: 'evens',
        testCases: [
          { args: [[1, 2, 3, 4]], expected: [2, 4] },
          { args: [[1, 3, 5]], expected: [] },
          { args: [[2, 4, 6]], expected: [2, 4, 6] },
        ],
      },
      {
        id: 'u7-c3',
        type: 'challenge',
        title: 'Pairwise sums',
        xp: 45,
        difficulty: 'Medium',
        prompt:
          'Write pair_sums(a, b) that RETURNS a list where each element is a[i] + b[i]. The lists have equal length.\n\npair_sums([1, 2], [3, 4]) → [4, 6]',
        starterCode: 'def pair_sums(a, b):\n    # add the lists element by element\n    pass\n',
        hints: ['zip(a, b) pairs the elements up.', '[x + y for x, y in zip(a, b)]'],
        checkType: 'return',
        functionName: 'pair_sums',
        testCases: [
          { args: [[1, 2], [3, 4]], expected: [4, 6] },
          { args: [[0], [5]], expected: [5] },
          { args: [[], []], expected: [] },
        ],
      },
    ],
  },

  // ───────────────────────────── UNIT 8 ─────────────────────────────
  {
    id: 'u8',
    title: 'Easy Algorithms',
    blurb: 'Classic interview warm-ups.',
    color: '#2b70c9',
    nodes: [
      {
        id: 'u8-c1',
        type: 'challenge',
        title: 'Reverse a string',
        xp: 45,
        difficulty: 'Easy',
        prompt:
          'Write reverse(s) that RETURNS the string reversed.\n\nreverse("python") → "nohtyp"',
        starterCode: 'def reverse(s):\n    # return s reversed\n    pass\n',
        hints: ['Slicing with a step of -1 reverses a sequence.', 'return s[::-1]'],
        checkType: 'return',
        functionName: 'reverse',
        testCases: [
          { args: ['python'], expected: 'nohtyp' },
          { args: ['a'], expected: 'a' },
          { args: [''], expected: '' },
        ],
      },
      {
        id: 'u8-c2',
        type: 'challenge',
        title: 'Palindrome?',
        xp: 45,
        difficulty: 'Easy',
        prompt:
          'Write is_palindrome(s) that RETURNS True if s reads the same forwards and backwards, else False.\n\nis_palindrome("racecar") → True',
        starterCode: 'def is_palindrome(s):\n    # return True or False\n    pass\n',
        hints: ['Compare the string to its reverse.', 'return s == s[::-1]'],
        checkType: 'return',
        functionName: 'is_palindrome',
        testCases: [
          { args: ['racecar'], expected: true },
          { args: ['hello'], expected: false },
          { args: ['abba'], expected: true },
        ],
      },
      {
        id: 'u8-c3',
        type: 'challenge',
        title: 'Count vowels',
        xp: 50,
        difficulty: 'Easy',
        prompt:
          'Write count_vowels(s) that RETURNS how many vowels (a, e, i, o, u) are in s. Assume lowercase input.\n\ncount_vowels("python") → 1',
        starterCode: 'def count_vowels(s):\n    # count a, e, i, o, u\n    pass\n',
        hints: ['Loop over the characters and check membership in "aeiou".', 'sum(1 for c in s if c in "aeiou")'],
        checkType: 'return',
        functionName: 'count_vowels',
        testCases: [
          { args: ['python'], expected: 1 },
          { args: ['aeiou'], expected: 5 },
          { args: ['xyz'], expected: 0 },
        ],
      },
      {
        id: 'u8-c4',
        type: 'challenge',
        title: 'Find the max',
        xp: 50,
        difficulty: 'Medium',
        prompt:
          'Write find_max(nums) that RETURNS the largest number in the list WITHOUT using the built-in max().\n\nfind_max([3, 7, 2, 9, 4]) → 9',
        starterCode: 'def find_max(nums):\n    # track the biggest you have seen\n    pass\n',
        hints: ['Start by assuming the first element is the biggest.', 'Loop and update when you find something larger.'],
        checkType: 'return',
        functionName: 'find_max',
        testCases: [
          { args: [[3, 7, 2, 9, 4]], expected: 9 },
          { args: [[-5, -2, -9]], expected: -2 },
          { args: [[42]], expected: 42 },
        ],
      },
      {
        id: 'u8-c5',
        type: 'challenge',
        title: 'Two Sum',
        xp: 60,
        difficulty: 'Medium',
        prompt:
          'Write two_sum(nums, target) that RETURNS the indices [i, j] (i < j) of the two numbers that add up to target. Exactly one solution exists.\n\ntwo_sum([2, 7, 11, 15], 9) → [0, 1]',
        starterCode: 'def two_sum(nums, target):\n    # return the two indices that sum to target\n    pass\n',
        hints: ['A brute-force double loop works: try every pair i < j.', 'For speed, store seen values in a dict mapping value → index.'],
        checkType: 'return',
        functionName: 'two_sum',
        testCases: [
          { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
          { args: [[3, 2, 4], 6], expected: [1, 2] },
          { args: [[3, 3], 6], expected: [0, 1] },
        ],
      },
    ],
  },

  // ───────────────────────────── UNIT 9 ─────────────────────────────
  {
    id: 'u9',
    title: 'Intermediate',
    blurb: 'Recursion, hashmaps, two pointers.',
    color: '#e8590c',
    nodes: [
      {
        id: 'u9-l1',
        type: 'lesson',
        title: 'Recursion',
        xp: 10,
        screens: [
          {
            title: 'A function that calls itself',
            body: 'Recursion solves a problem by reducing it to a smaller version of itself, stopping at a base case. Always handle the base case first to avoid infinite recursion.',
            example: {
              code: 'def factorial(n):\n    if n <= 1:        # base case\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5))   # 120',
            },
          },
        ],
      },
      {
        id: 'u9-c1',
        type: 'challenge',
        title: 'Factorial',
        xp: 50,
        difficulty: 'Medium',
        prompt:
          'Write factorial(n) that RETURNS n! = n × (n-1) × … × 1. factorial(0) is 1.\n\nfactorial(5) → 120',
        starterCode: 'def factorial(n):\n    # base case, then recurse (or loop)\n    pass\n',
        hints: ['Base case: n <= 1 returns 1.', 'Otherwise return n * factorial(n - 1).'],
        checkType: 'return',
        functionName: 'factorial',
        testCases: [
          { args: [5], expected: 120 },
          { args: [0], expected: 1 },
          { args: [1], expected: 1 },
          { args: [6], expected: 720 },
        ],
      },
      {
        id: 'u9-c2',
        type: 'challenge',
        title: 'Fibonacci',
        xp: 55,
        difficulty: 'Medium',
        prompt:
          'Write fib(n) that RETURNS the n-th Fibonacci number, where fib(0)=0, fib(1)=1, and each next is the sum of the previous two.\n\nfib(7) → 13',
        starterCode: 'def fib(n):\n    # 0, 1, 1, 2, 3, 5, 8, 13, ...\n    pass\n',
        hints: ['You can loop with two running variables a, b.', 'a, b = b, a + b updates both at once.'],
        checkType: 'return',
        functionName: 'fib',
        testCases: [
          { args: [0], expected: 0 },
          { args: [1], expected: 1 },
          { args: [7], expected: 13 },
          { args: [10], expected: 55 },
        ],
      },
      {
        id: 'u9-c3',
        type: 'challenge',
        title: 'First duplicate',
        xp: 55,
        difficulty: 'Medium',
        prompt:
          'Write first_dup(nums) that RETURNS the first value that appears twice as you scan left to right, or -1 if all values are unique.\n\nfirst_dup([2, 1, 3, 1, 2]) → 1',
        starterCode: 'def first_dup(nums):\n    # use a set to remember what you have seen\n    pass\n',
        hints: ['Keep a set of values already seen.', 'Return the first number that is already in the set.'],
        checkType: 'return',
        functionName: 'first_dup',
        testCases: [
          { args: [[2, 1, 3, 1, 2]], expected: 1 },
          { args: [[1, 2, 3]], expected: -1 },
          { args: [[5, 5]], expected: 5 },
        ],
      },
      {
        id: 'u9-c4',
        type: 'challenge',
        title: 'Two-pointer reverse',
        xp: 60,
        difficulty: 'Hard',
        prompt:
          'Write reverse_list(nums) that RETURNS the list reversed, using the two-pointer technique (swap ends moving inward). Do not use the built-in reverse or slicing.\n\nreverse_list([1, 2, 3, 4]) → [4, 3, 2, 1]',
        starterCode: 'def reverse_list(nums):\n    nums = list(nums)  # work on a copy\n    # left and right pointers, swap and move inward\n    pass\n',
        hints: ['Use i = 0 and j = len(nums) - 1.', 'Swap nums[i], nums[j] = nums[j], nums[i], then i += 1; j -= 1.'],
        checkType: 'return',
        functionName: 'reverse_list',
        testCases: [
          { args: [[1, 2, 3, 4]], expected: [4, 3, 2, 1] },
          { args: [[1]], expected: [1] },
          { args: [[]], expected: [] },
        ],
      },
    ],
  },

  // ───────────────────────────── UNIT 10 ────────────────────────────
  {
    id: 'u10',
    title: 'Harder Challenges',
    blurb: 'Real LeetCode-style problems.',
    color: '#c92a2a',
    nodes: [
      {
        id: 'u10-c1',
        type: 'challenge',
        title: 'Valid parentheses',
        xp: 65,
        difficulty: 'Hard',
        prompt:
          'Write is_valid(s) that RETURNS True if every bracket in s — ()[]{} — is correctly opened and closed in the right order, else False.\n\nis_valid("([])") → True, is_valid("(]") → False',
        starterCode: 'def is_valid(s):\n    # use a stack of opening brackets\n    pass\n',
        hints: ['Push opening brackets onto a list (a stack).', 'On a closing bracket, the top of the stack must be the matching opener.'],
        checkType: 'return',
        functionName: 'is_valid',
        testCases: [
          { args: ['()'], expected: true },
          { args: ['([])'], expected: true },
          { args: ['(]'], expected: false },
          { args: ['([)]'], expected: false },
          { args: [''], expected: true },
        ],
      },
      {
        id: 'u10-c2',
        type: 'challenge',
        title: 'Binary search',
        xp: 65,
        difficulty: 'Hard',
        prompt:
          'Write binary_search(nums, target) on a SORTED ascending list. RETURN the index of target, or -1 if it is absent.\n\nbinary_search([1, 3, 5, 7, 9], 7) → 3',
        starterCode: 'def binary_search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    # narrow the range by halves\n    pass\n',
        hints: ['Look at the middle element mid = (lo + hi) // 2.', 'If it is too small, search the right half (lo = mid + 1), else the left.'],
        checkType: 'return',
        functionName: 'binary_search',
        testCases: [
          { args: [[1, 3, 5, 7, 9], 7], expected: 3 },
          { args: [[1, 3, 5, 7, 9], 1], expected: 0 },
          { args: [[1, 3, 5, 7, 9], 4], expected: -1 },
          { args: [[], 1], expected: -1 },
        ],
      },
      {
        id: 'u10-c3',
        type: 'challenge',
        title: 'Merge two sorted lists',
        xp: 70,
        difficulty: 'Hard',
        prompt:
          'Write merge(a, b) where a and b are each sorted ascending. RETURN one merged sorted list containing all elements.\n\nmerge([1, 3, 5], [2, 4]) → [1, 2, 3, 4, 5]',
        starterCode: 'def merge(a, b):\n    # two pointers, take the smaller front each step\n    pass\n',
        hints: ['Walk i through a and j through b, appending the smaller head.', "Don't forget to append whatever remains in the longer list."],
        checkType: 'return',
        functionName: 'merge',
        testCases: [
          { args: [[1, 3, 5], [2, 4]], expected: [1, 2, 3, 4, 5] },
          { args: [[], [1, 2]], expected: [1, 2] },
          { args: [[1, 2], []], expected: [1, 2] },
          { args: [[1, 1], [1, 1]], expected: [1, 1, 1, 1] },
        ],
      },
      {
        id: 'u10-c4',
        type: 'challenge',
        title: 'Group anagrams',
        xp: 80,
        difficulty: 'Hard',
        prompt:
          'Write group_anagrams(words) that groups words made of the same letters. RETURN a list of groups where: each group is sorted alphabetically, and the groups are sorted by their first word.\n\ngroup_anagrams(["eat","tea","tan","ate","nat","bat"]) → [["ate","eat","tea"],["bat"],["nat","tan"]]',
        starterCode: 'def group_anagrams(words):\n    # key each word by its sorted letters\n    pass\n',
        hints: ['Two words are anagrams when their sorted letters match — use that as a dict key.', 'Sort each group, then sort the list of groups, before returning.'],
        checkType: 'return',
        functionName: 'group_anagrams',
        testCases: [
          {
            args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']],
            expected: [['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']],
          },
          { args: [['']], expected: [['']] },
          { args: [['a']], expected: [['a']] },
        ],
      },
    ],
  },
]

/** Flatten every node with a back-reference to its unit, in course order. */
export const allNodes = curriculum.flatMap((unit) =>
  unit.nodes.map((node) => ({ ...node, unitId: unit.id, unitTitle: unit.title })),
)

/** Ordered list of node ids — defines unlock prerequisites (linear path). */
export const nodeOrder = allNodes.map((n) => n.id)

export function getNode(id) {
  return allNodes.find((n) => n.id === id) || null
}

/**
 * A node is unlocked if it is the first node, or the node immediately before
 * it in course order is completed.
 */
export function isUnlocked(nodeId, completed) {
  const idx = nodeOrder.indexOf(nodeId)
  if (idx <= 0) return true
  return !!completed[nodeOrder[idx - 1]]
}

export function nextNodeId(nodeId) {
  const idx = nodeOrder.indexOf(nodeId)
  return idx >= 0 && idx < nodeOrder.length - 1 ? nodeOrder[idx + 1] : null
}

export const totalNodes = nodeOrder.length
