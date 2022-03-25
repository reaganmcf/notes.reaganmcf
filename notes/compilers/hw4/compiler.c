#include "stdio.h"
#include "unistd.h"
#include "stdlib.h"

#define MAX_PROGRAM_LEN 8192

int Program();
int Stmtlist();
int NextStmt();
int Stmt();
int Print();
int Assign();
int Expr();
int ID();
int ICONST();

char curr_token();
char next_token();

char* tokens = NULL;
unsigned int token_cnt = 0;
unsigned int cursor = 0;
unsigned register_num = 1;


// a, b, or c values
int a;
int b;
int c;

int main(int argc, char** argv) {
  tokens = calloc(MAX_PROGRAM_LEN, sizeof(char));
  token_cnt = read(STDIN_FILENO, tokens, MAX_PROGRAM_LEN);

  // trim last empty value
  token_cnt -= 1;

  // loadI 1024 => r0 is always outputed
  printf("loadI 1024 => r0\n");
  Program();
  
  //printf("Valid program? %s\n", Program() > 0 ? "true" : "false");
}

int Program() {
  char token = curr_token();
  switch(token) {
    case '!':
    case 'a':
    case 'b':
    case 'c':
      //printf("Program -> Stmtlist .\n");
      if (Stmtlist() < 0) {
        return -1;
      }

      // check '.'
      token = curr_token();
      return token == '.' ? 1 : -1;
    default:
      return -1;
  }
}

int Stmtlist() {
  char token = curr_token();
  switch (token) {
    case '!':
    case 'a':
    case 'b':
    case 'c':
      //printf("Stmtlist -> Stmt NextStmt\n");
      if (Stmt() < 0) {
        return -1;
      }

      token = next_token();
      return NextStmt();
    default:
      return -1;
  }
}

int NextStmt() {
  char token = curr_token();
  switch (token) {
    case '.':
      return 1;
    case ';':
      //printf("NextStmt -> ; Stmtlist\n");
      token = next_token();
      return Stmtlist();
    default:
      return -1;
  }
}

int Stmt() {
  char token = curr_token();
  switch (token) {
    case '!':
      //printf("Stmt -> Print\n");
      return Print();
    case 'a':
    case 'b':
    case 'c':
      //printf("Stmt -> Assign\n");
      return Assign();
    default:
      return -1;
  }
}

int Print() {
  char token = curr_token();
  switch(token) {
    case '!':
      //printf("Print -> ! ID\n");
      token = next_token();
      if (ID() < 0) {
        return -1;
      }
      
      switch (token) {
        case 'a':
          printf("outputAI r0, 4\n");
          break;
        case 'b':
          printf("outputAI r0, 8\n");
          break;
        case 'c':
          printf("outputAI r0, 12\n");
          break;
      }

      return 1;
    default:
      return -1;
  }
}

int Assign() {
  char token = curr_token();
  switch (token) {
    case 'a':
    case 'b':
    case 'c':
      //printf("Assign -> ID = Expr\n");
      if (ID() < 0) {
        return -1;
      }
      
      char id = token; 

      token = next_token();
      if (token != '=') {
        return -1;
      }

      next_token();
      int val = Expr();
      if (val < 0) {
        return -1;
      }

      //printf("\tAssigning %d to %c\n", val, id);
      switch (id) {
        case 'a':
          printf("storeAI r%d => r0, 4\n", val);
          break;
        case 'b':
          printf("storeAI r%d => r0, 8\n", val);
          break;
        case 'c':
          printf("storeAI r%d => r0, 12\n", val);
          break;
      }

      return 1;
    default:
      return -1;
  }
}

int Expr() {
  char token = curr_token();

  int lhs, rhs;
  switch(token) {
    case '+':
      //printf("Expr -> + Expr Expr\n");
      next_token();
      lhs = Expr();
      if (lhs < 0) {
        return -1;
      }

      next_token();
      rhs = Expr();
      if (rhs < 0) {
        return -1;
      } 
      
      printf("add r%d, r%d => r%d\n", lhs, rhs, register_num++);
      return register_num - 1;
    case '-':
      //printf("Expr -> - Expr Expr\n");
      next_token();
      lhs = Expr();
      if (lhs < 0) {
        return -1;
      }

      next_token();
      rhs = Expr();
      if (rhs < 0) {
        return -1;
      }

      printf("sub r%d, r%d => r%d\n", lhs, rhs, register_num++);
      return register_num - 1;
    case '*':
      //printf("Expr -> * Expr Expr\n");
      next_token();
      lhs = Expr();
      if (lhs < 0) {
        return -1;
      }

      next_token();
      rhs = Expr();
      if (rhs < 0) {
        return -1;
      }

      printf("mult r%d, r%d => r%d\n", lhs, rhs, register_num++);
      return register_num - 1;
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
      //printf("Expr -> ICONST\n");
      return ICONST();
    default: 
      return -1;
  }
}

int ID() {
  char token = curr_token();
  switch (token) {
    case 'a':
      //printf("ID -> a\n");
      return 1;
    case 'b':
      //printf("ID -> b\n");
      return 1;
    case 'c':
      //printf("ID -> c\n");
      return 1;
    default:
      return -1;
  }
}

int ICONST() {
  char token = curr_token();
  switch (token) {
    case '1':
      //printf("ICONST -> 1\n");
      printf("loadI 1 => r%d\n", register_num++);
      return register_num-1;
    case '2':
      //printf("ICONST -> 2\n");
      printf("loadI 2 => r%d\n", register_num++);
      return register_num-1;
    case '3':
      //printf("ICONST -> 3\n");
      printf("loadI 3 => r%d\n", register_num++);
      return register_num-1;
    case '4':
      //printf("ICONST -> 4\n");
      printf("loadI 4 => r%d\n", register_num++);
      return register_num-1;
    case '5':
      //printf("ICONST -> 1\n");
      printf("loadI 5 => r%d\n", register_num++);
      return register_num-1;
    default:
      return -1;
  }
}

char curr_token() {
  if (tokens == NULL) {
    printf("tokens cannot be NULL");
    exit(1);
  }

  return tokens[cursor];
}

char next_token() {
  if (tokens == NULL) {
    printf("tokens cannot be NULL");
    exit(1);
  }

  return tokens[++cursor];
}
