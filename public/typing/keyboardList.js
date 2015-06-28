function LetterRank (score, finger, row) {
	this.score = score;
	this.finger = finger;
	this.row = row;

	this.digraph = [];
}

var keyboardList = [];
keyboardList[0] = new LetterRank(1.9, 1, 1);	// q
keyboardList[1] = new LetterRank(1.4, 2, 1);	// w 
keyboardList[2] = new LetterRank(1.3, 3, 1);	// e 
keyboardList[3] = new LetterRank(1.1, 4, 1);	// r
keyboardList[4] = new LetterRank(1.3, 4, 1);	// t
keyboardList[5] = new LetterRank(1.3, 9, 1);	// y
keyboardList[6] = new LetterRank(1.1, 9, 1);	// u
keyboardList[7] = new LetterRank(1.3, 8, 1);	// i
keyboardList[8] = new LetterRank(1.4, 7, 1);	// o
keyboardList[9] = new LetterRank(1.9, 6, 1);	// p

keyboardList[10] = new LetterRank(1.5, 1, 2);	// a
keyboardList[11] = new LetterRank(1.2, 2, 2);	// s
keyboardList[12] = new LetterRank(1.1, 3, 2);	// d
keyboardList[13] = new LetterRank(1.0, 4, 2);	// f
keyboardList[14] = new LetterRank(1.0, 4, 2);	// g
keyboardList[15] = new LetterRank(1.0, 9, 2);	// h
keyboardList[16] = new LetterRank(1.0, 9, 2);	// j
keyboardList[17] = new LetterRank(1.1, 8, 2);	// k
keyboardList[18] = new LetterRank(1.2, 7, 2);	// l
keyboardList[19] = new LetterRank(1.5, 6, 2);	// ;

keyboardList[20] = new LetterRank(1.9, 1, 3);	// z
keyboardList[21] = new LetterRank(1.8, 2, 3);	// x
keyboardList[22] = new LetterRank(1.7, 3, 3);	// c
keyboardList[23] = new LetterRank(1.2, 4, 3);	// v
keyboardList[24] = new LetterRank(1.2, 4, 3);	// b
keyboardList[25] = new LetterRank(1.2, 9, 3);	// n
keyboardList[26] = new LetterRank(1.2, 9, 3);	// m
keyboardList[27] = new LetterRank(1.7, 8, 3);	// ,
keyboardList[28] = new LetterRank(1.7, 7, 3);	// .
keyboardList[29] = new LetterRank(1.9, 6, 3);	// /

//determine difficulty of digraph for the key BEFORE this key
// P
keyboardList[9].digraph[5] = 1.4;
keyboardList[9].digraph[6] = 1.3;
keyboardList[9].digraph[7] = 1.5;
keyboardList[9].digraph[8] = 1.7;
keyboardList[9].digraph[9] = 2.00;			//same key
keyboardList[9].digraph[15] = 1.2;
keyboardList[9].digraph[16] = 1.3;
keyboardList[9].digraph[17] = 1.5;
keyboardList[9].digraph[18] = 1.8;
keyboardList[9].digraph[19] = 2.2;
keyboardList[9].digraph[25] = 1.2;
keyboardList[9].digraph[26] = 1.4;
keyboardList[9].digraph[27] = 2.0;
keyboardList[9].digraph[28] = 2.2;
keyboardList[9].digraph[29] = 2.5;

// O
keyboardList[8].digraph[5] = 1.4;
keyboardList[8].digraph[6] = 1.3;
keyboardList[8].digraph[7] = 1.5;
keyboardList[8].digraph[8] = 2.00;			//same key
keyboardList[8].digraph[9] = 2.2;
keyboardList[8].digraph[15] = 1.3;
keyboardList[8].digraph[16] = 1.2;
keyboardList[8].digraph[17] = 1.6;
keyboardList[8].digraph[18] = 2.0;
keyboardList[8].digraph[19] = 2.0;
keyboardList[8].digraph[25] = 1.4;
keyboardList[8].digraph[26] = 1.5;
keyboardList[8].digraph[27] = 2.0;
keyboardList[8].digraph[28] = 2.3;
keyboardList[8].digraph[29] = 2.3;

// I
keyboardList[7].digraph[5] = 1.4;
keyboardList[7].digraph[6] = 1.3;
keyboardList[7].digraph[7] = 2.00;			//same key
keyboardList[7].digraph[8] = 1.3;
keyboardList[7].digraph[9] = 1.8;
keyboardList[7].digraph[15] = 1.2;
keyboardList[7].digraph[16] = 1.1;
keyboardList[7].digraph[17] = 1.7;
keyboardList[7].digraph[18] = 1.4;
keyboardList[7].digraph[19] = 1.5;
keyboardList[7].digraph[25] = 1.4;
keyboardList[7].digraph[26] = 1.4;
keyboardList[7].digraph[27] = 2.2;
keyboardList[7].digraph[28] = 2.0;
keyboardList[7].digraph[29] = 2.4;

// U
keyboardList[6].digraph[5] = 1.9;
keyboardList[6].digraph[6] = 2.00;			//same key
keyboardList[6].digraph[7] = 1.2;
keyboardList[6].digraph[8] = 1.3;
keyboardList[6].digraph[9] = 1.7;
keyboardList[6].digraph[15] = 1.8;
keyboardList[6].digraph[16] = 1.6;
keyboardList[6].digraph[17] = 1.3;
keyboardList[6].digraph[18] = 1.4;
keyboardList[6].digraph[19] = 1.5;
keyboardList[6].digraph[25] = 2.0;
keyboardList[6].digraph[26] = 2.0;
keyboardList[6].digraph[27] = 1.8;
keyboardList[6].digraph[28] = 1.7;
keyboardList[6].digraph[29] = 2.2;

// Y
keyboardList[5].digraph[5] = 1.9;			//same key
keyboardList[5].digraph[6] = 2.00;
keyboardList[5].digraph[7] = 1.2;
keyboardList[5].digraph[8] = 1.3;
keyboardList[5].digraph[9] = 1.7;
keyboardList[5].digraph[15] = 1.8;
keyboardList[5].digraph[16] = 1.6;
keyboardList[5].digraph[17] = 1.3;
keyboardList[5].digraph[18] = 1.4;
keyboardList[5].digraph[19] = 1.5;
keyboardList[5].digraph[25] = 2.0;
keyboardList[5].digraph[26] = 2.0;
keyboardList[5].digraph[27] = 1.8;
keyboardList[5].digraph[28] = 1.7;
keyboardList[5].digraph[29] = 2.2;

// ;
keyboardList[19].digraph[5] = 1.8;
keyboardList[19].digraph[6] = 1.5;
keyboardList[19].digraph[7] = 1.5;
keyboardList[19].digraph[8] = 2.2;
keyboardList[19].digraph[9] = 2.5;
keyboardList[19].digraph[15] = 1.4;
keyboardList[19].digraph[16] = 1.3;
keyboardList[19].digraph[17] = 1.5;
keyboardList[19].digraph[18] = 1.9;
keyboardList[19].digraph[19] = 2.00;			//same key
keyboardList[19].digraph[25] = 1.4;
keyboardList[19].digraph[26] = 1.5;
keyboardList[19].digraph[27] = 1.9;
keyboardList[19].digraph[28] = 2.2;
keyboardList[19].digraph[29] = 2.5;

// L
keyboardList[18].digraph[5] = 1.8;
keyboardList[18].digraph[6] = 1.5;
keyboardList[18].digraph[7] = 1.6;
keyboardList[18].digraph[8] = 2.0;
keyboardList[18].digraph[9] = 2.4;
keyboardList[18].digraph[15] = 1.3;
keyboardList[18].digraph[16] = 1.2;
keyboardList[18].digraph[17] = 1.4;
keyboardList[18].digraph[18] = 2.00;			//same key
keyboardList[18].digraph[19] = 1.7;
keyboardList[18].digraph[25] = 1.3;
keyboardList[18].digraph[26] = 1.3;
keyboardList[18].digraph[27] = 1.9;
keyboardList[18].digraph[28] = 2.5;
keyboardList[18].digraph[29] = 2.3;

// K
keyboardList[17].digraph[5] = 1.8;
keyboardList[17].digraph[6] = 1.6;
keyboardList[17].digraph[7] = 1.8;
keyboardList[17].digraph[8] = 1.4;
keyboardList[17].digraph[9] = 1.6;
keyboardList[17].digraph[15] = 1.4;
keyboardList[17].digraph[16] = 1.2;
keyboardList[17].digraph[17] = 2.00;			//same key
keyboardList[17].digraph[18] = 1.1;
keyboardList[17].digraph[19] = 1.6;
keyboardList[17].digraph[25] = 1.5;
keyboardList[17].digraph[26] = 1.3;
keyboardList[17].digraph[27] = 2.0;
keyboardList[17].digraph[28] = 1.4;
keyboardList[17].digraph[29] = 2.1;

// J
keyboardList[16].digraph[5] = 1.9;
keyboardList[16].digraph[6] = 1.7;
keyboardList[16].digraph[7] = 1.1;
keyboardList[16].digraph[8] = 1.3;
keyboardList[16].digraph[9] = 1.6;
keyboardList[16].digraph[15] = 1.7;
keyboardList[16].digraph[16] = 2.00;			//same key
keyboardList[16].digraph[17] = 1.0;
keyboardList[16].digraph[18] = 1.1;
keyboardList[16].digraph[19] = 1.4;
keyboardList[16].digraph[25] = 1.8;
keyboardList[16].digraph[26] = 1.7;
keyboardList[16].digraph[27] = 1.5;
keyboardList[16].digraph[28] = 1.4;
keyboardList[16].digraph[29] = 2.0;

// H
keyboardList[15].digraph[5] = 2.1;
keyboardList[15].digraph[6] = 1.7;
keyboardList[15].digraph[7] = 1.3;
keyboardList[15].digraph[8] = 1.4;
keyboardList[15].digraph[9] = 1.6;
keyboardList[15].digraph[15] = 2.00;			//same key
keyboardList[15].digraph[16] = 1.7;
keyboardList[15].digraph[17] = 1.2;
keyboardList[15].digraph[18] = 1.3;
keyboardList[15].digraph[19] = 1.4;
keyboardList[15].digraph[25] = 1.9;
keyboardList[15].digraph[26] = 2.1;
keyboardList[15].digraph[27] = 1.6;
keyboardList[15].digraph[28] = 1.5;
keyboardList[15].digraph[29] = 2.0;

// /
keyboardList[29].digraph[5] = 1.9;
keyboardList[29].digraph[6] = 1.5;
keyboardList[29].digraph[7] = 1.6;
keyboardList[29].digraph[8] = 2.0;
keyboardList[29].digraph[9] = 2.5;
keyboardList[29].digraph[15] = 1.5;
keyboardList[29].digraph[16] = 1.4;
keyboardList[29].digraph[17] = 1.6;
keyboardList[29].digraph[18] = 1.8;
keyboardList[29].digraph[19] = 2.3;
keyboardList[29].digraph[25] = 1.4;
keyboardList[29].digraph[26] = 1.3;
keyboardList[29].digraph[27] = 1.8;
keyboardList[29].digraph[28] = 2.1;
keyboardList[29].digraph[29] = 2.00;			//same key

// .
keyboardList[28].digraph[5] = 2.0;
keyboardList[28].digraph[6] = 1.4;
keyboardList[28].digraph[7] = 1.9;
keyboardList[28].digraph[8] = 2.3;
keyboardList[28].digraph[9] = 2.2;
keyboardList[28].digraph[15] = 1.4;
keyboardList[28].digraph[16] = 1.3;
keyboardList[28].digraph[17] = 1.7;
keyboardList[28].digraph[18] = 2.1;
keyboardList[28].digraph[19] = 2.0;
keyboardList[28].digraph[25] = 1.5;
keyboardList[28].digraph[26] = 1.4;
keyboardList[28].digraph[27] = 1.9;
keyboardList[28].digraph[28] = 2.00;			//same key
keyboardList[28].digraph[29] = 2.0;

// ,
keyboardList[27].digraph[5] = 2.1;
keyboardList[27].digraph[6] = 1.7;
keyboardList[27].digraph[7] = 2.2;
keyboardList[27].digraph[8] = 2.1;
keyboardList[27].digraph[9] = 2.5;
keyboardList[27].digraph[15] = 1.4;
keyboardList[27].digraph[16] = 1.2;
keyboardList[27].digraph[17] = 2.0;
keyboardList[27].digraph[18] = 1.7;
keyboardList[27].digraph[19] = 1.6;
keyboardList[27].digraph[25] = 1.5;
keyboardList[27].digraph[26] = 1.2;
keyboardList[27].digraph[27] = 2.00;			//same key
keyboardList[27].digraph[28] = 1.4;
keyboardList[27].digraph[29] = 1.8;

// M
keyboardList[26].digraph[5] = 2.5;
keyboardList[26].digraph[6] = 2.3;
keyboardList[26].digraph[7] = 1.4;
keyboardList[26].digraph[8] = 1.3;
keyboardList[26].digraph[9] = 1.5;
keyboardList[26].digraph[15] = 2.1;
keyboardList[26].digraph[16] = 2.0;
keyboardList[26].digraph[17] = 1.3;
keyboardList[26].digraph[18] = 1.1;
keyboardList[26].digraph[19] = 1.3;
keyboardList[26].digraph[25] = 2.1;
keyboardList[26].digraph[26] = 2.00;			//same key
keyboardList[26].digraph[27] = 1.3;
keyboardList[26].digraph[28] = 1.2;
keyboardList[26].digraph[29] = 1.6;

// N
keyboardList[25].digraph[5] = 2.4;
keyboardList[25].digraph[6] = 2.2;
keyboardList[25].digraph[7] = 1.2;
keyboardList[25].digraph[8] = 1.2;
keyboardList[25].digraph[9] = 1.5;
keyboardList[25].digraph[15] = 1.9;
keyboardList[25].digraph[16] = 2.0;
keyboardList[25].digraph[17] = 1.2;
keyboardList[25].digraph[18] = 1.3;
keyboardList[25].digraph[19] = 1.4;
keyboardList[25].digraph[25] = 2.00;			//same key
keyboardList[25].digraph[26] = 2.1;
keyboardList[25].digraph[27] = 1.4;
keyboardList[25].digraph[28] = 1.6;
keyboardList[25].digraph[29] = 1.7;

// Q
keyboardList[0].digraph[0] = 2.00;			//same key
keyboardList[0].digraph[1] = 2.3;
keyboardList[0].digraph[2] = 1.7;
keyboardList[0].digraph[3] = 1.4;
keyboardList[0].digraph[4] = 1.5;
keyboardList[0].digraph[10] = 2.7;
keyboardList[0].digraph[11] = 2.5;
keyboardList[0].digraph[12] = 1.9;
keyboardList[0].digraph[13] = 1.3;
keyboardList[0].digraph[14] = 1.4;
keyboardList[0].digraph[20] = 2.8;
keyboardList[0].digraph[21] = 2.6;
keyboardList[0].digraph[22] = 2.1;
keyboardList[0].digraph[23] = 1.4;
keyboardList[0].digraph[24] = 1.4;

// W
keyboardList[1].digraph[0] = 1.9;
keyboardList[1].digraph[1] = 2.00;			//same key
keyboardList[1].digraph[2] = 1.4;
keyboardList[1].digraph[3] = 1.3;
keyboardList[1].digraph[4] = 1.4;
keyboardList[1].digraph[10] = 2.3;
keyboardList[1].digraph[11] = 2.2;
keyboardList[1].digraph[12] = 1.7;
keyboardList[1].digraph[13] = 1.2;
keyboardList[1].digraph[14] = 1.4;
keyboardList[1].digraph[20] = 2.6;
keyboardList[1].digraph[21] = 2.7;
keyboardList[1].digraph[22] = 2.5;
keyboardList[1].digraph[23] = 1.6;
keyboardList[1].digraph[24] = 1.8;

// E
keyboardList[2].digraph[0] = 2.1;
keyboardList[2].digraph[1] = 1.4;
keyboardList[2].digraph[2] = 2.00;			//same key
keyboardList[2].digraph[3] = 1.3;
keyboardList[2].digraph[4] = 1.4;
keyboardList[2].digraph[10] = 1.8;
keyboardList[2].digraph[11] = 1.6;
keyboardList[2].digraph[12] = 2.0;
keyboardList[2].digraph[13] = 1.2;
keyboardList[2].digraph[14] = 1.3;
keyboardList[2].digraph[20] = 2.3;
keyboardList[2].digraph[21] = 2.7;
keyboardList[2].digraph[22] = 2.5;
keyboardList[2].digraph[23] = 1.5;
keyboardList[2].digraph[24] = 1.7;

// R
keyboardList[3].digraph[0] = 1.5;
keyboardList[3].digraph[1] = 1.4;
keyboardList[3].digraph[2] = 1.2;
keyboardList[3].digraph[3] = 2.00;			//same key
keyboardList[3].digraph[4] = 2.1;
keyboardList[3].digraph[10] = 1.6;
keyboardList[3].digraph[11] = 1.5;
keyboardList[3].digraph[12] = 1.3;
keyboardList[3].digraph[13] = 2.0;
keyboardList[3].digraph[14] = 2.1;
keyboardList[3].digraph[20] = 2.2;
keyboardList[3].digraph[21] = 2.4;
keyboardList[3].digraph[22] = 2.5;
keyboardList[3].digraph[23] = 2.4;
keyboardList[3].digraph[24] = 2.5;

// T
keyboardList[4].digraph[0] = 1.6;
keyboardList[4].digraph[1] = 1.3;
keyboardList[4].digraph[2] = 1.2;
keyboardList[4].digraph[3] = 2.0;
keyboardList[4].digraph[4] = 2.00;			//same key
keyboardList[4].digraph[10] = 1.4;
keyboardList[4].digraph[11] = 1.5;
keyboardList[4].digraph[12] = 1.6;
keyboardList[4].digraph[13] = 2.2;
keyboardList[4].digraph[14] = 2.1;
keyboardList[4].digraph[20] = 2.1;
keyboardList[4].digraph[21] = 2.3;
keyboardList[4].digraph[22] = 2.4;
keyboardList[4].digraph[23] = 2.5;
keyboardList[4].digraph[24] = 2.6;

// A
keyboardList[10].digraph[0] = 2.5;
keyboardList[10].digraph[1] = 2.4;
keyboardList[10].digraph[2] = 1.4;
keyboardList[10].digraph[3] = 1.5;
keyboardList[10].digraph[4] = 1.8;
keyboardList[10].digraph[10] = 2.00;			//same key
keyboardList[10].digraph[11] = 1.6;
keyboardList[10].digraph[12] = 1.3;
keyboardList[10].digraph[13] = 1.2;
keyboardList[10].digraph[14] = 1.3;
keyboardList[10].digraph[20] = 2.7;
keyboardList[10].digraph[21] = 2.4;
keyboardList[10].digraph[22] = 2.0;
keyboardList[10].digraph[23] = 1.4;
keyboardList[10].digraph[24] = 1.6;

// S
keyboardList[11].digraph[0] = 2.5;
keyboardList[11].digraph[1] = 2.5;
keyboardList[11].digraph[2] = 1.8;
keyboardList[11].digraph[3] = 1.6;
keyboardList[11].digraph[4] = 1.7;
keyboardList[11].digraph[10] = 1.3;
keyboardList[11].digraph[11] = 2.00;			//same key
keyboardList[11].digraph[12] = 1.3;
keyboardList[11].digraph[13] = 1.2;
keyboardList[11].digraph[14] = 1.4;
keyboardList[11].digraph[20] = 2.3;
keyboardList[11].digraph[21] = 2.7;
keyboardList[11].digraph[22] = 1.8;
keyboardList[11].digraph[23] = 1.3;
keyboardList[11].digraph[24] = 1.5;

// D
keyboardList[12].digraph[0] = 1.9;
keyboardList[12].digraph[1] = 1.7;
keyboardList[12].digraph[2] = 2.0;
keyboardList[12].digraph[3] = 1.6;
keyboardList[12].digraph[4] = 1.7;
keyboardList[12].digraph[10] = 1.4;
keyboardList[12].digraph[11] = 1.3;
keyboardList[12].digraph[12] = 2.00;			//same key
keyboardList[12].digraph[13] = 1.1;
keyboardList[12].digraph[14] = 1.2;
keyboardList[12].digraph[20] = 1.9;
keyboardList[12].digraph[21] = 2.2;
keyboardList[12].digraph[22] = 2.4;
keyboardList[12].digraph[23] = 1.3;
keyboardList[12].digraph[24] = 1.5;

// F
keyboardList[13].digraph[0] = 1.7;
keyboardList[13].digraph[1] = 1.4;
keyboardList[13].digraph[2] = 1.3;
keyboardList[13].digraph[3] = 2.1;
keyboardList[13].digraph[4] = 2.5;
keyboardList[13].digraph[10] = 1.4;
keyboardList[13].digraph[11] = 1.2;
keyboardList[13].digraph[12] = 1.0;
keyboardList[13].digraph[13] = 2.00;			//same key
keyboardList[13].digraph[14] = 2.2;
keyboardList[13].digraph[20] = 1.9;
keyboardList[13].digraph[21] = 2.2;
keyboardList[13].digraph[22] = 2.0;
keyboardList[13].digraph[23] = 2.3;
keyboardList[13].digraph[24] = 2.6;

// G
keyboardList[14].digraph[0] = 1.7;
keyboardList[14].digraph[1] = 1.5;
keyboardList[14].digraph[2] = 1.2;
keyboardList[14].digraph[3] = 2.4;
keyboardList[14].digraph[4] = 2.1;
keyboardList[14].digraph[10] = 1.4;
keyboardList[14].digraph[11] = 1.3;
keyboardList[14].digraph[12] = 1.3;
keyboardList[14].digraph[13] = 2.0;
keyboardList[14].digraph[14] = 2.00;			//same key
keyboardList[14].digraph[20] = 1.8;
keyboardList[14].digraph[21] = 1.6;
keyboardList[14].digraph[22] = 1.4;
keyboardList[14].digraph[23] = 2.1;
keyboardList[14].digraph[24] = 2.3;

// Z
keyboardList[20].digraph[0] = 2.7;
keyboardList[20].digraph[1] = 2.7;
keyboardList[20].digraph[2] = 1.8;
keyboardList[20].digraph[3] = 1.7;
keyboardList[20].digraph[4] = 1.9;
keyboardList[20].digraph[10] = 2.5;
keyboardList[20].digraph[11] = 2.0;
keyboardList[20].digraph[12] = 1.7;
keyboardList[20].digraph[13] = 1.4;
keyboardList[20].digraph[14] = 1.3;
keyboardList[20].digraph[20] = 2.00;			//same key
keyboardList[20].digraph[21] = 2.4;
keyboardList[20].digraph[22] = 1.9;
keyboardList[20].digraph[23] = 1.5;
keyboardList[20].digraph[24] = 1.4;

// X
keyboardList[21].digraph[0] = 2.6;
keyboardList[21].digraph[1] = 2.7;
keyboardList[21].digraph[2] = 2.8;
keyboardList[21].digraph[3] = 2.1;
keyboardList[21].digraph[4] = 2.0;
keyboardList[21].digraph[10] = 1.9;
keyboardList[21].digraph[11] = 2.5;
keyboardList[21].digraph[12] = 2.1;
keyboardList[21].digraph[13] = 1.6;
keyboardList[21].digraph[14] = 1.3;
keyboardList[21].digraph[20] = 1.8;
keyboardList[21].digraph[21] = 2.00;			//same key
keyboardList[21].digraph[22] = 1.8;
keyboardList[21].digraph[23] = 1.6;
keyboardList[21].digraph[24] = 1.5;

// C
keyboardList[22].digraph[0] = 1.7;
keyboardList[22].digraph[1] = 2.5;
keyboardList[22].digraph[2] = 2.5;
keyboardList[22].digraph[3] = 2.5;
keyboardList[22].digraph[4] = 1.9;
keyboardList[22].digraph[10] = 1.5;
keyboardList[22].digraph[11] = 1.6;
keyboardList[22].digraph[12] = 2.0;
keyboardList[22].digraph[13] = 1.4;
keyboardList[22].digraph[14] = 1.3;
keyboardList[22].digraph[20] = 1.6;
keyboardList[22].digraph[21] = 1.2;
keyboardList[22].digraph[22] = 2.00;			//same key
keyboardList[22].digraph[23] = 1.3;
keyboardList[22].digraph[24] = 1.4;

// V
keyboardList[23].digraph[0] = 1.6;
keyboardList[23].digraph[1] = 1.5;
keyboardList[23].digraph[2] = 1.4;
keyboardList[23].digraph[3] = 2.5;
keyboardList[23].digraph[4] = 2.5;
keyboardList[23].digraph[10] = 1.2;
keyboardList[23].digraph[11] = 1.3;
keyboardList[23].digraph[12] = 1.3;
keyboardList[23].digraph[13] = 2.3;
keyboardList[23].digraph[14] = 2.2;
keyboardList[23].digraph[20] = 1.7;
keyboardList[23].digraph[21] = 1.5;
keyboardList[23].digraph[22] = 1.2;
keyboardList[23].digraph[23] = 2.00;			//same key
keyboardList[23].digraph[24] = 2.2;

// B
keyboardList[24].digraph[0] = 1.5;
keyboardList[24].digraph[1] = 1.6;
keyboardList[24].digraph[2] = 1.8;
keyboardList[24].digraph[3] = 2.7;
keyboardList[24].digraph[4] = 2.7;
keyboardList[24].digraph[10] = 1.3;
keyboardList[24].digraph[11] = 1.4;
keyboardList[24].digraph[12] = 1.3;
keyboardList[24].digraph[13] = 2.5;
keyboardList[24].digraph[14] = 2.4;
keyboardList[24].digraph[20] = 1.6;
keyboardList[24].digraph[21] = 1.5;
keyboardList[24].digraph[22] = 1.3;
keyboardList[24].digraph[23] = 2.2;
keyboardList[24].digraph[24] = 2.00;			//same key